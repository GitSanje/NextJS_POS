"use server";
import { cache } from "@/lib/cache";
import { response } from "@/lib/utils";
import { supplierSchema } from "@/schemas";
import { supplierType, SelectType } from "@/types";
import { prisma } from "@/vendor/prisma";
import { revalidatePath } from "next/cache";
import { notFound } from "next/navigation";


// Function overloads
export function getSuppliers(fromClient: true): Promise<SelectType[] | null>;
export function getSuppliers(fromClient: false): Promise<supplierType | null>;
export function getSuppliers(fromClient: boolean): Promise<SelectType[] | supplierType | null>;

export async function getSuppliers(fromClient: boolean): Promise<SelectType[] | supplierType | null>{
  try {
    const suppliers:supplierType = await prisma.supplier.findMany({
      select: {
        id: true,
        supplierName: true,
        email: true,
        phone: true,
        address:true,
        _count: {
          select: {
            products: true,
          },
        },
      },
    });
    if(!suppliers){
      return notFound();
    }

    if (fromClient) {
      const supplersClient: SelectType[] = suppliers.map((sup) => ({
        id: sup.id,
        label: sup.supplierName.toUpperCase(),
        value: sup.supplierName,
      }));
      return supplersClient;
    }
    return suppliers;
  } catch (error) {
    console.log(error);

    return null;
  }

}

export const addSupplier = async (payload: FormData) => {
  const validatedFields = supplierSchema.safeParse(
    Object.fromEntries(payload.entries())
  );
  console.log(validatedFields?.error);

  if (!validatedFields.success) {
    return response({
      success: false,
      error: {
        code: 422,
        message: "invalid fields",
      },
    });
  }

  try {
    const data = validatedFields.data;
    const supplier = await prisma.supplier.create({
      data: {
        supplierName: data.suppliername,
        email: data.email,
        phone: data.phone,
      },
    });
    if (supplier) {
      revalidatePath("/admin/suppliers");
      return response({
        success: true,
        code: 201,
        message: "Supplier added successfully",
      });
    }
  } catch (error) {
    console.log(error, "unkwnon");

    return response({
      success: false,

      error: {
        code: 500,
        message: "Unknown error occurred",
      },
    });
  }
};

export const updateSupplier = async (id: string, payload: FormData) => {
  const validatedFields = supplierSchema.safeParse(
    Object.fromEntries(payload.entries())
  );
 
  


  if (!validatedFields.success) {
    return response({
      success: false,
      error: {
        code: 422,
        message: "invalid fields",
      },
    });
  }
  try {
    const supplier = await prisma.supplier.findUnique({ where: { id } });
  
   
    if (supplier == null) return notFound();

    const data = validatedFields.data;
    const updatesupplier = await prisma.supplier.update({
      where: { id },

      data: {
        supplierName: data.suppliername,
        email: data.email,
        phone: data.phone,
      },
    });

    if (updatesupplier) {
      revalidatePath("/admin/suppliers");

      return response({
        success: true,
        code: 201,
        message: "Supplier updated successfully",
      });
    }
  } catch (error) {
    return null;
  }
};

export const deleteSupplier = async (id: string) => {
  try {
    const supplier = await prisma.supplier.delete({ where: { id } });
    if (supplier == null) return notFound();
    revalidatePath("/");
    revalidatePath("/admin/suppliers");
    return response({
      success: true,
      code: 201,
      message: "Supplier deleted successfully",
    });
  } catch (error) {
    return null;
  }
};
