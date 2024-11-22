"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "../../vendor/prisma";
import { cache } from "@/lib/cache";
import { notFound } from "next/navigation";
import { response } from "@/lib/utils";
import { InvoiceDataType, InvoiceType, OrderType, OrderWithCartsType } from "@/src/types";

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
export async function deleteOrder(id: string) {
  try {
    await prisma.order.delete({
      where: {
        id: id as string,
      },
    });

    revalidatePath("/admin/orders");
  } catch (error) {
    console.log('====================================');
    console.log(error);
    console.log('====================================');
  }
}

export const getAOrder = cache(
  async (id: string | undefined) => {
    try {
      if (id === undefined) return null;

      const order: OrderType = await prisma.order.findUnique({
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

     

      if (order == null) return notFound();
      return order;
    } catch (error) {
      console.log(error);

      return null;
    }
  },
  ["/admin/orders/view/[id]", "getAOrder"],

  { revalidate: 40 }
);
export const getUserOrder = cache(
  async (userId: string | undefined) => {
    try {
      if (userId === undefined) return null;
      console.log(userId);

      const orders: OrderWithCartsType[] = await prisma.order.findMany({
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

export const getInvoice = async (orderId: string): Promise<InvoiceDataType | null> => {
  try {
    const invoice = await prisma.salesInvoice.findUnique({
      where: {
        orderId: orderId,
      },
      select: {
        InvoiceId: true, // Invoice ID
        invoiceDate: true, // Invoice Date
        order: {
          select: {
            id: true, // Order ID
            state: true, // State
            orderDate: true, // Order Date
            streetAddress: true, // Street Address
            city: true, // City
            user: {
              select: {
                email: true, // User's email
                name: true, // User's name
              },
            },
            carts: {
              select: {
                quantity: true, // Fetch quantity
                amount: true, // Fetch amount
                product: {
                  select: {
                    salePrice: true, // Product sale price
                    discount: true, // Product discount
                    taxId: true, // Product tax ID
                    tax: {
                      select: {
                        rate: true, // Tax rate
                      },
                    },
                    name: true, // Product name
                  },
                },
                variants: {
                  select: {
                    discount: true, // Variant discount
                    salePrice: true, // Variant sale price
                    variant: {
                      select: {
                        id: true, // Variant ID
                        name: true, // Variant name
                        status: true, // Variant status
                      },
                    },
                    option: {
                      select: {
                        value: true, // Variant option value
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

    if (!invoice) {
      return null;
    }
    const Invoicedata: InvoiceDataType = {
      id: invoice.order?.id,
      state: invoice.order?.state,
      orderDate: invoice.order?.orderDate,
      streetAddress: invoice.order?.streetAddress,
      city: invoice.order?.city,
      user: {
        email: invoice.order?.user.email,
        name: invoice.order?.user.name,
      },
      carts: invoice.order?.carts.map((cart) => ({
        quantity: cart.quantity, // Map quantity
        amount: cart.amount ?? 0, // Map amount (default to 0 if null)
        product: {
          name: cart.product.name,
          salePrice: cart.product.salePrice ?? 0, // Handle null salePrice
          discount: cart.product.discount ?? null, // Handle null discount
          taxId: cart.product.taxId ?? null, // Handle null taxId
          tax: cart.product.tax,
        },
        variants: cart.variants.map((variant) => ({
          discount: variant.discount ?? null,
          salePrice: variant.salePrice,
          variant: variant.variant,
          option: variant.option,
        })),
      })),
      InvoiceId: invoice.InvoiceId,
      invoiceDate: invoice.invoiceDate,
    };

    return Invoicedata; 
 


  } catch (error) {
    return null; 
  }
};
