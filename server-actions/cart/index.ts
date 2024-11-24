"use server";
import { cache } from "@/lib/cache";
import { response } from "@/lib/utils";
import { prisma } from "@/vendor/prisma";

import { notFound } from "next/navigation";
import { CartType } from "@/types";
import { Response } from '@/types'
import { Cart } from "@prisma/client";
import { revalidateTag } from "next/cache";

export type UserCart = {
  cartItems: CartType ,
  subtotal : number,
  totaltax: number
}
export type responseUserCart = Response &{
  data?:UserCart;

}

export const getUserCarts = cache( async (userId: string | null): Promise<responseUserCart>=> {
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

    const subtotal =
      cartItems.length > 0
        ? cartItems.reduce((sum, cart) => {
            return sum + (cart.amount ?? 0);
          }, 0)
        : 0;

    const totaltax =
      cartItems.length > 0
        ? parseFloat(cartItems.reduce((sum, item) => {
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
          }, 0).toFixed(2))


        : 0  ;

        const cartdetails:UserCart = { cartItems, subtotal,totaltax}

       

        return {
          success: true,
          code: 200,
          message: "Successfully fetched cart details",
          data: cartdetails,
        };
        
  } catch (error) {
    return response({
      success: false,

      error: {
        code: 500,
        message: "Unknown error occurred",
      },
    });
  }
},
["getuserCarts"],

{ revalidate: 30 *30 , tags:['userCartsData']}
);



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


export type cartResponse = Response & {
  data?: Cart
}
export const postCarts = async (userId:string,quantity:number, productId:string, amount: number,productVariantIds: (string | undefined)[] ): Promise<cartResponse>  => {

    // Create the cart item
   try {

    console.log('====================================');
    console.log(userId,quantity, productId, productVariantIds,amount);
    console.log('====================================');
     const cartItems = await prisma.cart.create({ 
       data: {
         userId: userId,
         productId: productId ,
         variants:   productVariantIds && productVariantIds.length > 0 ? {
           connect: productVariantIds.map(id => ({ id }))
         }: undefined,
         quantity,
         amount: (amount?? 0) * quantity
         
       },
     });

     if(!cartItems){
      return response({
        success: false,
  
        error: {
          code: 500,
          message: "Unknown error occurred",
        },
      });

     }

     revalidateTag("userCartsData");
     return {
      success:true,
      code: 200,
      message: "Successfully added to cart",
      data : cartItems
      
     }
 
   } catch (error) {
    return response({
      success: false,

      error: {
        code: 500,
        message: "Unknown error occurred",
      },
    });
    
   }


} 

export const addCart = async ( productId: string, amount: number): Promise<Response | undefined> => {

  try {
    // Fetch the cart item
    const cartItem = await prisma.cart.findFirst({
      where: { productId },
      select: { id: true, quantity: true },
    });

    if (!cartItem) {
      return response({
        success: false,
        error: {
          code: 404,
          message: "Cart not found",
        },
      });
    }

  
      await prisma.cart.update({
        where: { id: cartItem.id },
        data: {
          quantity: { increment: 1 },
          amount: { increment: amount },
        },
      });

      return response({
        success: true,
        code: 200,
        message: "added an item to cart",
      });
    
    
  } catch (error) {
    console.error("Error removing item from cart:", error);

    return response({
      success: false,
      error: {
        code: 500,
        message: "Unknown error occurred",
      },
    });
  }

}
export const removeCart = async (productId: string, amount: number): Promise<Response | undefined> => {
  try {
    // Fetch the cart item
    const cartItem = await prisma.cart.findFirst({
      where: { productId },
      select: { id: true, quantity: true },
    });

    if (!cartItem) {
      return response({
        success: false,
        error: {
          code: 404,
          message: "Cart not found",
        },
      });
    }

    // Check the quantity and perform the appropriate action
    if (cartItem.quantity > 1) {
      // Update quantity and amount
      await prisma.cart.update({
        where: { id: cartItem.id },
        data: {
          quantity: { decrement: 1 },
          amount: { decrement: amount },
        },
      });

      return response({
        success: true,
        code: 200,
        message: "Removed an item from cart",
      });
    } else {
      // Delete the cart item
      await prisma.cart.delete({
        where: { id: cartItem.id },
      });

      return response({
        success: true,
        code: 200,
        message: "Removed the cart successfully",
      });
    }
  } catch (error) {
    console.error("Error removing item from cart:", error);

    return response({
      success: false,
      error: {
        code: 500,
        message: "Unknown error occurred",
      },
    });
  }
};

