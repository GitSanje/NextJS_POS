"use server";
import { CheckoutState, checkoutSchema } from "./definitions";
import { prisma } from "../../vendor/prisma";
import { revalidatePath } from "next/cache";
import { response } from "@/lib/utils";
import { generateInvoiceId } from "@/src/lib/utils";
import { getServerSession } from "next-auth";
import { authOptions } from "@/src/app/api/auth/[...nextauth]/options";


export async function checkout(
  // prevState: CheckoutState,
  formData: FormData
) {
  const session = await getServerSession(authOptions)
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

    } = validatedFields.data;

    // Find the user by email
    // const user = await prisma.user.findUnique({
    //   where: { email },
    //   select: { id: true },
    // });

    // if (!user) {
    //   return response({
    //     success: false,
    //     error: {
    //       message: `User with email ${email} not found`,
    //       code: 404,
    //     },
    //   });
    // }

    // Find pending carts for the user
    const pendingCarts = await prisma.cart.findMany({
      where: { status: "PENDING", userId: session?.user.id },
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
            discount: true,
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
      return response({ success: false,
        error:{
          code:404,
          message: "No pending carts found for the user" }
        }
        );
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
        userId: session?.user.id as string,
        paymentStatus:true,

        products: {
          connect: pendingCarts.map((cart) => ({ id: cart.productId })),
        },
        carts: {
          connect: pendingCarts.map((cart) => ({ id: cart.id })),
        },
      },
    });
    // const subTotal =  pendingCarts.reduce((sum, cart) => {
    //   return sum +( cart?.amount ?? 0)
    //  },0 )
    // const totaltax = pendingCarts.reduce((sum, item) => {
    //   const productPrice =
    //           item.variants.length > 0
    //             ? item.variants.find(
    //                 (var_p) => var_p.variant.name === "Size"
    //               )?.salePrice || item.product.salePrice
    //             : item.product.salePrice;
    //   return sum + (item.product?.tax?.rate ?? 0)/ 100 *( productPrice ?? 0)
    //  },0 ) 

    // Update cart status to "CHECKOUT"
    await prisma.cart.updateMany({
      where: { id: { in: pendingCarts.map((cart) => cart.id) } },
      data: { status: "CHECKOUT" },
    });

    // const salesInvoice = await prisma.salesInvoice.create({
    //   data: {
    //     InvoiceId: await generateInvoiceId(),
    //     orderId: order.id,
    //     totalAmount: subTotal+ totaltax,

    //     tax: {
    //       connect: taxtIds.map((id) => ({ id })),
    //     },
    //   },
    // });

    // console.log(order, salesInvoice);

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
          quantity: quantity,
          streetAddress: streetaddress,
          city: city,
          user: {
            email: email,
            name: name

          },
          // InvoiceId: salesInvoice.InvoiceId,
          carts: pendingCarts,
          // invoiceDate: salesInvoice.invoiceDate
        
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
