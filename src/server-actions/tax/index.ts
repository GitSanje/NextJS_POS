
"use server";
import { cache } from "@/lib/cache";

import { response } from "@/lib/utils";
import { taxSchema } from "@/src/schemas";
import { prisma } from "@/src/vendor/prisma";
import { revalidatePath } from "next/cache";
import { notFound } from "next/navigation";

type Tax = {
    id: string;
    name: string;
    rate: number;
  };
  
type TaxClient = {
    id: string;
    label: string;
    value: string;
  };
export const getTaxes= cache(
    async (fromClient: boolean = false): Promise< Tax[] | TaxClient[] > => {
      try {
        const taxs = await prisma.tax.findMany({
          select: {
            id: true,
            name:true,
            rate:true
            
           
          },
        });
  
        if (fromClient) {
          const taxsClient = taxs.map((tax) => ({
            id: tax.id,
            label: tax.name + " - " + tax.rate.toString()+"%",
            value: tax.name.toUpperCase(),
          }));
          return taxsClient;
        }
        return taxs;
      } catch (error) {
        console.log(error);
        return [];
      }
    },
    ["/", "getTaxes"],
    { revalidate: 30*60 }
  );
  
  

  
export const updateTax = async (id: string, payload: FormData) => {
    const validatedFields = taxSchema.safeParse(
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
      const data = validatedFields.data;
      const tax = await prisma.tax.findUnique({ where: { id } });
      
    if (tax == null) return notFound();
      const updatedTax = await prisma.tax.update({
        where: { id },
        data: {
          name: data.name,
          rate: data.rate,
          description: data.description,
        
        },
      });
      if (updatedTax) {
        revalidatePath("/admin/products/new");
        return response({
          success: true,
          code: 201,
          message: "updated  tax successfully",
          data:{
            id: tax.id,
            label: tax.name + " - " + tax.rate.toString()+"%",
            value: tax.name.toUpperCase(),
          } 
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
  
export const addTax = async (payload: FormData) => {
    const validatedFields = taxSchema.safeParse(
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
      const data = validatedFields.data;
      const tax = await prisma.tax.create({
        data: {
          name: data.name.toLowerCase(),
          rate: data.rate,
          description: data.description,
        
        },
      });
      if (tax) {
        revalidatePath("/admin/products/new");
        return response({
          success: true,
          code: 201,
          message: "created  tax successfully",
          data:{
            id: tax.id,
            label: tax.name + " - " + tax.rate.toString()+"%",
            value: tax.name.toUpperCase(),
          } 
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