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
  console.log(validatedFields.data, validatedFields.error);

  if (!validatedFields.success) {
    return response({
      success: false,
      error: {
        code: 422,
        message: "invalid fields",
      },
    });
  }

  try {
    const {
      name,
      phone,
      email,
      streetaddress,
      state,
      city,
      paymentMethod,
      subtotal,
    } = validatedFields.data;

    // Find the user by email
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });

    if (!user) {
      return response({
        success: false,
        error: {
          message: `User with email ${email} not found`,
          code: 404,
        },
      });
    }

    // Find pending carts for the user
    const pendingCarts = await prisma.cart.findMany({
      where: { status: "PENDING", userId: user.id },
      include: {
        product: {
          select: {
            salePrice: true,
            discount: true,
            taxId: true,
            tax: true,
          },
        },
        variants: {
          select: {
            salePrice: true,
            variant: true,
            option: {
              select: {
                value: true,
              },
            },
          },
        },
      },
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
    const taxtIds = pendingCarts
      .map((cart) => cart.product.taxId)
      .filter((id): id is string => id !== null);
    console.log("taxtIds", taxtIds);
    const quantity = pendingCarts.reduce((sum, cart) => sum + cart.quantity, 0);
    // Create order
    const order = await prisma.order.create({
      data: {
        orderDate: new Date(),
        quantity: quantity,
        deliveryDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days ahead
        state,
        streetAddress: streetaddress,
        city,
        userId: user.id,

        products: {
          connect: pendingCarts.map((cart) => ({ id: cart.productId })),
        },
        carts: {
          connect: pendingCarts.map((cart) => ({ id: cart.id })),
        },
      },
    });
    const total = pendingCarts.reduce((total, item) => {
      let var_opt;
      if (item.variants.length > 0 && item.status === "PENDING") {
        item.variants.map((var_product) => {
          if (var_product.variant.name === "Size") {
            var_opt = var_product.salePrice;
          }
          var_opt = var_product.salePrice;
        });
      }

      const price =
        var_opt !== undefined
          ? var_opt
          : item.variants.length == 0 && item.status === "PENDING"
          ? item.product?.salePrice ?? 0
          : 0;

      return total + price * (item.quantity || 0);
    }, 0);

    // Update cart status to "CHECKOUT"
    await prisma.cart.updateMany({
      where: { id: { in: pendingCarts.map((cart) => cart.id) } },
      data: { status: "CHECKOUT" },
    });

    const salesInvoice = await prisma.salesInvoice.create({
      data: {
        InvoiceId: await generateInvoiceId(),
        orderId: order.id,
        totalAmount: total,

        tax: {
          connect: taxtIds.map((id) => ({ id })),
        },
      },
    });

    console.log(order, salesInvoice);

    revalidatePath("/order");
    revalidatePath("/view-cart");
    revalidatePath("/");

    return response({
      success: true,
      code: 201,
      message: "Order placed successfully",
      data: {
         
          id: order.id,
          state: state,
          orderDate: order.orderDate,
          streetAddress: streetaddress,
          city: city,
          email: email,
          name: name,
          quantity: quantity,
          InvoiceId: salesInvoice.id,
          carts: pendingCarts,
        
      },
    });
  } catch (error) {
    console.log(error);
    return response({
      success: false,
      error: {
        message: `error to post checkout`,
        code: 500,
      },
    });
  }
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
