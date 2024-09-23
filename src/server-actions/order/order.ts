"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "../../vendor/prisma";
import { cache } from "@/lib/cache";
import { notFound } from "next/navigation";

export async function deleteOrder(formData: FormData): Promise<any> {
  try {
    const data = {
      id: formData.get("id"),
    };
    const order = await prisma.order.delete({
      where: {
        id: data?.id as string,
      },
    });

    revalidatePath("/");
  } catch (error) {
    return {
      error: " There was an error on deleting",
    };
  }
}

export const getAOrder = cache(
  async (userId: string | undefined) => {
    try {
      if( userId === undefined ) return null;
      const orders = await prisma.order.findMany({
        where: {
          userId: userId as string,
        },
        include: {
    
          carts: {
            select: {
              quantity: true,
              product: {
                select: {
                  id: true,
                  name: true,
                  salePrice: true,
                },
              },
              variant: {
                select: {
                  id: true,
                  name: true,
                  salePrice: true,
                },
              },
            },
          },
        },
      });
      if (orders == null) return notFound();
      return orders;
    } catch (error) {}
  },
  ["/order", "/checkout", "getAOrder"],

  { revalidate: 24 * 60 * 60 }
);
