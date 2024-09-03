import { create } from "zustand";


type CartState = {
    
    cart: any[];
    isLoading: boolean;
    counter: number;
    getCart: (userId: string) => void;
    addItem: (userEmail: string, productName: string, variantName: string, quantity: number) => void;
    removeItem: (itemId: string) => void;

}

export const useCartStore = create<CartState>((set) => ({
    cart: [],
    isLoading: true,
    counter: 0,

    getCart: async (userId: string) => {
    set({ isLoading: true});
    try {
        const response = await fetch(`/api/cart/${userId}`, {
            method: 'GET'
         
        });
        const data = await response.json()

        set({
            cart: data?.cartItems || [],
            isLoading: false,
            counter: data?.cartItems.length || 0
        });
        
    } catch (error) {
        console.error('Failed to fetch cart:', error);
        set({ isLoading: false });
    }

    },
    addItem: async (userEmail, productName, variantName, quantity) => {
        set({ isLoading: true });
        try {
          const response = await fetch('/api/cart', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userEmail, productName, variantName, quantity }),
          });
          const data = await response.json();
          set({
            cart: data?.cartItems || [],
            counter: data?.cartItems.length || 0,
            isLoading: false,
          });
        } catch (error) {
          console.error('Failed to add item to cart:', error);
          set({ isLoading: false });
        }
      },
      removeItem: async (itemId: string) => {
        set({ isLoading: true });
        try {
          const response = await fetch('/api/cart', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ itemId }),
          });
          const data = await response.json();
          set({
            cart: data?.cartItems || [],
            counter: data?.cartItems.length || 0,
            isLoading: false,
          });
        } catch (error) {
          console.error('Failed to remove item from cart:', error);
          set({ isLoading: false });
        }
      },

}))

