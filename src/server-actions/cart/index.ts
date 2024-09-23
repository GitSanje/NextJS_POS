"use server"
import { cache } from "@/lib/cache";
import { prisma } from "@/src/vendor/prisma";
import { notFound } from "next/navigation";

export const getCarts = cache(
  async (id:string | undefined) => {
    try {
        if(id === undefined) return notFound()
      const carts = await prisma.cart.findMany({
        where: {
            id:id
        },
        select: {
          id: true,
          productId:true
        },
      });
      if(!carts) return notFound()

      return carts;
    } catch (error) {
      console.log(error);

      return null;
    }
  },
  ["/checkout", "getCarts"],
  { revalidate: 2   }
);
