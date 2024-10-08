import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { create } from "zustand";


type CartState = {
    
    cart: any[];
    isLoading: boolean;
    counter: number;
    subTotal: number;
    pendingTotal: number;
    getCart: (userId: string) => void;
    addItem: (userId: string, productId: string, amount?:number,productVariantIds?: string[], quantity?: number,) => void;
    removeItem: (cartId: string) => void;

}

export const useCartStore = create<CartState>((set) => ({
    cart: [],
    isLoading: true,
    counter: 0,
    subTotal: 0,
    pendingTotal: 0,


    getCart: async (userId: string) => {
    set({ isLoading: true});
    try {
        const response = await fetch(`/api/cart/?userId=${userId}`, {
            method: 'GET',
            // cache:'force-cache'
        });
        const data = await response.json()
        
        set({
            cart: data?.cartItems || [],
            isLoading: false,
            counter: data?.cartItems.length || 0,
            subTotal: data?.subtotal || 0,
            pendingTotal: data?.pendingTotal || 0
        });
        
    } catch (error) {
        console.error('Failed to fetch cart:', error);
        set({ isLoading: false });
    }

    },
    addItem: async (userId, productId, productVariantIds, quantity,amount) => {
        set({ isLoading: true });
        try {
          const response = await fetch('/api/cart', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, productId, productVariantIds, quantity,amount }),
          });
          const data = await response.json();
          set({
            cart: data?.cartItems || [],
            counter: data?.cartItems.length || 0,
            isLoading: false,
          });
          toast.success("product added to cart successfully", {
            autoClose:2000

          })
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
          toast.success("Cart removed successfully", {
            autoClose:2000

          })
        } catch (error) {
          console.error('Failed to remove item from cart:', error);
          set({ isLoading: false });
        }
      },

}))

