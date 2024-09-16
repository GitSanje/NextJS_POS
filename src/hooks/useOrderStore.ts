import { Product, Variant } from "@prisma/client";
import next from "next";
import { create } from "zustand";



interface Cart{
  quantity: number;
  product: Product;
  variant?: Variant;

}
interface Order {
  id: string;
  orderDate: string;
  deliveryDate: string;
  quantity: number;
  streetAddress: string;
  city: string;
  state: string;
  status: string;
  carts: Cart[]
}



type OrderState = {
    orders: Order[],
//   cart: any[];
//   quantity: number;
//   streetadress: string;
//   status: string;
//   deliveryDate: string;
  isLoading: boolean;
  counter: number;
  getOrder: (userId: string) => void;
};

export const useOrderStore = create<OrderState>((set) => ({
//   cart: [],
 isLoading: true,
//   quantity: 0,
//   status: "",
//   streetadress: "",
//   deliveryDate: "",
orders:[],
  counter: 0,

  getOrder: async (userId: string) => {
    set({ isLoading: true });

    try {
      const res = await fetch(`api/order?userId=${userId}`, {
        method: "GET",
        cache:'force-cache'
        
      } );
      const data = await res.json();

      set({
        orders: data?.orders,
        counter: data?.orders.length || 0,
        isLoading: false,
        
      });
    } catch (error) {
      console.error("Failed to fetch order:", error);
      set({ isLoading: false });
    }
  },
}));
