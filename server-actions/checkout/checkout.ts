"use server";
import { CheckoutState, checkoutSchema, checkoutType } from "./definitions";
import { prisma } from "../../vendor/prisma";
import { revalidatePath } from "next/cache";
import { response } from "@/lib/utils";
import { generateInvoiceId } from "@/lib/utils";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { CartItem } from "@/types/orderType";
import { Response } from "@/types";
type ReturnType  = Response & {
  data?: {
    id: string;
    amount: number;
    productName: string;
  }

} 

export async function checkout(
  values: checkoutType,
  cartItems: CartItem[],
  amount: number
): Promise<ReturnType> {
  const session = await getServerSession(authOptions);
  if (!session) {
    return response({
      success: false,
      error: {
        code: 401,
        message: "User is not authenticated",
      },
    });
  }
console.log(values,cartItems,amount,'from checkout');

  try {
    const { streetaddress, state, city, paymentMethod, name, email,phone } = values;

    // Validate cart items
    if (!cartItems || cartItems.length === 0) {
      return response({
        success: false,
        error: {
          code: 404,
          message: "No items in the cart",
        },
      });
    }
    const productName = cartItems[0].product?.name

    // Find or create the payment method
    let paymentMethodRecord = await prisma.paymentType.findFirst({
      where: { paymentType: paymentMethod },
    });

    if (!paymentMethodRecord) {
      paymentMethodRecord = await prisma.paymentType.create({
        data: { paymentType: paymentMethod!},
      });
    }

    // Extract unique tax IDs from cart items
    // const taxIds = cartItems
    //   .map((cart) => cart.product?.taxId)
    //   .filter((id): id is string => id !== null);

    const quantity = cartItems.reduce((sum, cart) => sum + cart.quantity, 0);

    // Create order
    const order = await prisma.order.create({
      data: {
        orderDate: new Date(),
        quantity,
        deliveryDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days ahead
        state,
        streetAddress: streetaddress,
        city,
        userId: session.user.id as string,
        paymentStatus: true,
        products: {
          connect: cartItems.map((cart) => ({ id: cart.product?.id })),
        },
        carts: {
          connect: cartItems.map((cart) => ({ id: cart.id })),
        },
        amount: amount,
      },
    });

    // Update cart status to "CHECKOUT"
    await prisma.cart.updateMany({
      where: { productId: { in: cartItems.map((cart) => cart.product?.id !) } },
      data: { status: "CHECKOUT" },
    });

    // Revalidate cache for necessary pages
    revalidatePath("/order");
    revalidatePath("/view-cart");
    revalidatePath("/");

    return {
      success: true,
      code: 201,
      message: "Order placed successfully",
      data: {
        id: order.id,
        amount: amount,
        productName : productName !,
      },
    };
  } catch (error) {
    console.error("Error during checkout:", error);
    return response({
      success: false,
      error: {
        message: "Error occurred during checkout",
        code: 500,
      },
    });
  }
}
