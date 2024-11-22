import { Product, Variant } from "@prisma/client";
import next from "next";
import { create } from "zustand";
import { getUserOrder } from "../server-actions/order/order";



interface Cart{
  quantity: number;
  product: Product;
  variant?: Variant;

}
interface Order {
  id: string;
  orderDate: Date;
  deliveryDate: Date;
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

      const userOrders = await getUserOrder(userId)
      // const res = await fetch(`api/order?userId=${userId}`, {
      //   method: "GET",
     
        
      // } );
      // const data = await res.json();

      set({
        // orders:userOrders ?? [],
        counter: userOrders?.length || 0,
        isLoading: false,
        
      });
    } catch (error) {
      console.error("Failed to fetch order:", error);
      set({ isLoading: false });
    }
  },
}));
