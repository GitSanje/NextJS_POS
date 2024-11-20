"use server";
import { cache } from "@/lib/cache";
import { response } from "@/lib/utils";
import { prisma } from "@/src/vendor/prisma";

import { notFound } from "next/navigation";
import { CartType } from "@/src/types";



export const getUserCarts = async (userId: string | null) => {
  try {
    if (!userId) {
      return notFound();
    }

    const cartItems: CartType = await prisma.cart.findMany({
      where: { userId: userId as string, status: "PENDING" },
      include: {
        product: {
          select: {
            discount: true,
            salePrice: true,
            name: true,
            tax: {
              select: {
                rate: true,
              },
            },
          },
        },
        variants: {
          include: {
            option: true,
            variant: true,
          },
        },
      },
    });

    if (!cartItems || cartItems.length === 0) {
      return response({
        success: false,

        error: {
          code: 404,
          message: "cartItem not found",
        },
      });
    }

    const subTotal =
      cartItems.length > 0
        ? cartItems.reduce((sum, cart) => {
            return sum + (cart.amount ?? 0);
          }, 0)
        : 0;

    const totaltax =
      cartItems.length > 0
        ? cartItems.reduce((sum, item) => {
            const productPrice =
              item.variants.length > 0
                ? item.variants.find((var_p) => var_p.variant.name === "Size")
                    ?.salePrice ||
                  (item.product?.salePrice ?? 0)
                : item.product?.salePrice ?? 0;
            return (
              sum +
              (item.product?.tax
                ? (item.product.tax.rate / 100) * productPrice
                : productPrice)
            );
          }, 0)


        : 0;

        const cartdetails = { cartItems, subTotal,totaltax}

    return cartdetails;
  } catch (error) {
    return response({
      success: false,

      error: {
        code: 500,
        message: "Unknown error occurred",
      },
    });
  }
};



export const getCarts = cache(
  async (id: string | undefined) => {
    try {
      if (id === undefined) return notFound();
      const carts = await prisma.cart.findMany({
        where: {
          id: id,
        },
        select: {
          id: true,
          productId: true,
        },
      });
      if (!carts) return notFound();

      return carts;
    } catch (error) {
      console.log(error);

      return null;
    }
  },
  ["/checkout", "getCarts"],
  { revalidate: 2 }
);
