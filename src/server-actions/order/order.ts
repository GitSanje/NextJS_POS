"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "../../vendor/prisma";
import { cache } from "@/lib/cache";
import { notFound } from "next/navigation";
import { response } from "@/lib/utils";

export const getAllOrders = cache(
  async () => {
    try {
      const orders = await prisma.order.findMany({
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
              variants: {
                select: {
                  salePrice: true,
                  variant: true,
                  option: {
                    select: {
                      value: true,
                    },
                  },
                },
              },
            },
          },
        },
      });

      return orders;
    } catch (error) {
      console.log(error);

      return null;
    }
  },
  ["/admin/orders", "getAllOrders"],

  {
    revalidate: 2,
  }
);
export async function deleteOrder(id: string): Promise<any> {
  try {
    await prisma.order.delete({
      where: {
        id: id as string,
      },
    });

    revalidatePath("/admin/orders");
  } catch (error) {
    return {
      error: " There was an error on deleting",
    };
  }
}

export const getAOrder = cache(
  async (id: string | undefined) => {
    try {
      if (id === undefined) return null;

      const order = await prisma.order.findUnique({
        where: {
          id: id as string,
        },
        include: {
          user: true,
          carts: {
            select: {
              quantity: true,
              amount: true,
              product: {
                select: {
                  id: true,
                  name: true,
                  salePrice: true,
                },
              },
              variants: {
                select: {
                  salePrice: true,
                  variant: true,
                  option: {
                    select: {
                      value: true,
                    },
                  },
                },
              },
            },
          },
        },
      });

      console.log("====================================");
      console.log(JSON.stringify(order, null, 2));
      console.log("====================================");

      if (order == null) return notFound();
      return order;
    } catch (error) {
      console.log(error);

      return null;
    }
  },
  ["/admin/orders/view/[id]", "getAOrder"],

  { revalidate: 2 }
);
export const getUserOrder = cache(
  async (userId: string | undefined) => {
    try {
      if (userId === undefined) return null;
      console.log(userId);

      const orders = await prisma.order.findMany({
        where: {
          userId: userId as string,
        },
        include: {
          carts: {
            select: {
              quantity: true,
              amount: true,
              product: {
                select: {
                  id: true,
                  name: true,
                  salePrice: true,
                },
              },
              variants: {
                select: {
                  salePrice: true,
                  variant: true,
                  option: {
                    select: {
                      value: true,
                    },
                  },
                },
              },
            },
          },
        },
      });

     

      if (orders == null) return notFound();
      return orders;
    } catch (error) {
      console.log(error);

      return null;
    }
  },
  ["/order", "getUserOrder"],

  { revalidate: 2 }
);

export const getInvoice = async (orderId: string) => {
  try {
    const invoice = await prisma.salesInvoice.findUnique({
      where: {
        orderId: orderId,
      },
      select: {
        InvoiceId: true,
        invoiceDate: true,
        totalAmount: true,
        order: {
          include: {
            user: {
              select: {
                name: true,
                email: true,
              },
            },
            carts: {
              include: {
                product: {
                  select: {
                    salePrice: true,
                    discount: true,
                    taxId: true,
                    tax: true,
                    name:true
                  },
                },
                variants: {
                  select: {
                    salePrice: true,
                    variant: true,
                    option: {
                      select: {
                        value: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });
    const Invoicedata = {
      id: invoice?.order.id,
      state: invoice?.order.state,
      orderDate: invoice?.order.orderDate,
      streetAddress: invoice?.order.streetAddress,
      city: invoice?.order.city,
      user: {
        email:invoice?.order.user.email,
         name: invoice?.order.user.name,
      },
      carts: invoice?.order.carts,
      InvoiceId: invoice?.InvoiceId,
    };
  console.log('====================================');
  console.log(Invoicedata,invoice,orderId,'Invoicedata from server');
  console.log('====================================');

    return  Invoicedata
  } catch (error) {
    return null; 
  }
};
