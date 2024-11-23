
import 'react-toastify/dist/ReactToastify.css';
import { create } from "zustand";
import { CartType } from "../types";
import { getUserCarts, postCarts } from "../server-actions/cart";
import { toast } from "sonner";

import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
//router:  AppRouterInstance ,

type CartState = {
    
    cart: CartType;
    isLoading: boolean;
    counter: number;
    subTotal: number;
    totaltax: number;
    
    getCart: (userId: string) => void;
    addItem: (userId: string,quantity: number, productId: string , amount:number,productVariantIds: (string | undefined)[]) => void;
    removeItem: (cartId: string) => void;

}


export const useCartStore = create<CartState>((set) => ({
    cart: [],
    isLoading: false,
    counter: 0,
    subTotal: 0,
    totaltax:0,
 


    getCart: async (userId: string) => {
 
    try {
      set({ isLoading: true});
        const response = await getUserCarts( userId);
        
        if(!response.success)
          {
            return null;
          }
        set({
            cart: response.data?.cartItems || [],
            isLoading: false,
            counter: response.data?.cartItems.length || 0,
            subTotal: response.data?.subtotal,
            totaltax: response.data?.totaltax
            
           
        });
        
    } catch (error) {
        console.error('Failed to fetch cart:', error);
        set({ isLoading: false });
    }

    },
    addItem: async (userId,quantity, productId,amount, productVariantIds) => {
        set({ isLoading: true });
        try {
      console.log("add items ",userId,quantity, productId,amount, productVariantIds );
       
          const response =  await postCarts(userId,quantity, productId,amount, productVariantIds)
          if( response.success){
            toast.success(response.message)
            // set({
            //   cart: response.data || [],
            //   counter: response.data?.length || 0,
            //   isLoading: false,
            // });
            // router.push("/view-cart")
            
          }
          // const response = await fetch('/api/cart', {
          //   method: 'POST',
          //   headers: { 'Content-Type': 'application/json' },
          //   body: JSON.stringify({userId,quantity, productId, productVariantIds,amount }),
          // });
          // const data = await response.json();
         
          // toast.success("product added to cart successfully")
          // router.push("/view-order")
        } catch (error) {
          console.error('Failed to add item to cart:', error);
          set({ isLoading: false });
        }
      },
      removeItem: async (cartId: string) => {
        set({ isLoading: true });
        try {
          const response = await fetch('/api/cart', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ cartId }),
          });
          const data = await response.json();
          set({
            cart: data?.cartItems || [],
            counter: data?.cartItems.length || 0,
            isLoading: false,
          });
          toast.success("Cart removed successfully")
        } catch (error) {
          console.error('Failed to remove item from cart:', error);
          set({ isLoading: false });
        }
      },

}))

