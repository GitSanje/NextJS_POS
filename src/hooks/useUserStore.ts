import { create } from "zustand";

type UserState = {
  user: any[];
  isLoading: boolean;
  getUser: (userId: string) => void;
};
export const useUserState = create<UserState>((set) => ({
  user: [],
  isLoading: true,
  getUser: async (userId: string) => {
    set({isLoading:true})
    const response = await fetch(`/api/user/?userId=${userId}`, {
      method: 'GET'
  });
  const data = await response.json()
   set({
    isLoading:false,
    user: data?.user

   })
  },
}));
