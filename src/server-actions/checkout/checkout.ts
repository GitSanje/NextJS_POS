"use server";
import { CheckoutState, checkoutSchema } from "./definitions";
import { prisma } from "../../vendor/prisma";
import { revalidatePath } from "next/cache";
import { response } from "@/lib/utils";
import { generateInvoiceId } from "@/src/lib/utils";

export async function checkout(
  // prevState: CheckoutState,
  formData: FormData
) {
  console.log('====================================');
  console.log(formData,'from server');
  console.log('====================================');
  // Validate form fields using Zod schema
  const validatedFields = checkoutSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    state: formData.get("state"),
    city: formData.get("city"),
    streetaddress: formData.get("streetaddress"),
    paymentMethod: formData.get("paymentMethod"),
    subtotal: formData.get("subtotal"),
  });
 console.log(validatedFields.data,'validatedFields');
 
  if (!validatedFields.success) {
    return response( {
      success: false,
      error: {
        code: 422,
        message: "invalid fields",
      },
    });
  }


  const { name, phone, email, streetaddress, state, city, paymentMethod, subtotal } =
    validatedFields.data;

  // Find the user by email
  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true },
  });

  if (!user) {
    return { success: false, message: `User with email ${email} not found` };
  }

  // Find pending carts for the user
  const pendingCarts = await prisma.cart.findMany({
    where: { status: "PENDING", userId: user.id },
    include: { product: true},
  });

  if (pendingCarts.length === 0) {
    return { success: false, message: "No pending carts found for the user" };
  }

  // Find or create payment method
  let paymentMethodRecord = await prisma.paymentType.findFirst({
    where: { paymentType: paymentMethod },
  });

  if (!paymentMethodRecord) {
    paymentMethodRecord = await prisma.paymentType.create({
      data: { paymentType: paymentMethod },
    });
  }
  const taxtIds = pendingCarts.map((cart) => cart.product.taxId)

  
  // Create order
  const order = await prisma.order.create({
    data: {
      orderDate: new Date(),
      quantity: pendingCarts.reduce((sum, cart) => sum + cart.quantity, 0),
      deliveryDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days ahead
      state,
      streetAddress: streetaddress,
      city,
      userId: user.id,

      products: {
        connect: pendingCarts.map(cart => ({ id: cart.productId })),
      },
      carts: {
        connect: pendingCarts.map(cart => ({ id: cart.id })),
      }
      
    },
  });

  // Update cart status to "CHECKOUT"
  await prisma.cart.updateMany({
    where: { id: { in: pendingCarts.map(cart => cart.id) } },
    data: { status: "CHECKOUT" },
  });

 await prisma.salesInvoice.create({
    data: {
      InvoiceId: generateInvoiceId(),
      orderId: order.id,
      totalAmount: subtotal,
      tax: {
        connect: taxtIds.map(id => {{id}})
      }
      
    },
  });

  revalidatePath("/order");
  revalidatePath("/view-cart");
  revalidatePath("/");

  return response({
    success: true,
    code: 201,
    message: "Order placed successfully",
  });
}







//   const filteredCarts =

  //   const productVariants = await Promise.all(
  //     pendingCarts.map( async cart => {
  //         if( cart.variantId){
  //             const variant = await prisma.variant.findFirst({
  //                 where: {
  //                     id: cart.variantId,
  //                     productId: cart.productId
  //                 }

  //             })

  //             return  variant ? { productId: cart.productId, variantId: cart.variantId } : { productId: cart.productId, variantId: null };
  //         }
  //         return { productId: cart.productId, variantId: null };
  //     })

  //   )
  // Filter out invalid variant-product pairs
  //    const validVariantsFiltered = productVariants.filter(Boolean);

  //    // Extract product IDs from pending carts
  //    const productIds = pendingCarts.map(cart => cart.productId)
  //    const variantIds = pendingCarts
  //                        .filter(cart => cart.variantId)// Only keep carts with a variant
  //                        .map(cart => cart.variantId);

