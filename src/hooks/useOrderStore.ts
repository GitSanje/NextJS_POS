import { create } from "zustand";

type OrderState = {
    orders: any[],
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
      });
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
