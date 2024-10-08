"use server";


import { response } from "@/lib/utils";
import { productSchema } from "@/src/schemas";
import { prisma } from "@/src/vendor/prisma";
import { z } from "zod";
import fs from "fs/promises";
import { notFound, redirect } from "next/navigation";
import { revalidatePath } from "next/cache";






const writeImageToDisk = async (image:File) => {
    await fs.mkdir("public/products", { recursive: true })
    const imagepath = `/products/${crypto.randomUUID()}~${image.name}`;
    await fs.writeFile(
      `public${imagepath}`,
      Buffer.from(await image.arrayBuffer())
    );
    return imagepath;
  };

  
export const addProduct = async (
  payload:FormData)=> {
 
  const payloadObject: any = {};
    
  for (const [key, value] of payload.entries()) {
    try {
      // Try to parse JSON values (for arrays and objects)
      payloadObject[key] = JSON.parse(value as string);
    } catch (error) {
      // If parsing fails, assign the value as it is (for non-JSON values like strings or files)
      payloadObject[key] = value as string;
    }
  }

  console.log(payloadObject,'payload from server', payloadObject.image instanceof File);
  const validatedFields =  productSchema.safeParse( payloadObject)

  
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
   const imagepath = await writeImageToDisk(data.image);
   const supplierIds = data.suppliers.map((sup) => sup.id);
 
   console.log(imagepath,'imagepath from server');
     
   const product = await prisma.product.create({
     data: {
       name: data.name,
       image: imagepath,
       costPrice: data.costPrice,
       quantityInStock: data.quantityInStock,
       categoryId: (
         await prisma.category.findFirst({
           where: { categoryName: "Electronics" },
         })
       )?.id!,
       description: data.description,
       validity: data.validity,
       discount: data.discount || null,
       salePrice: data.salePrice,
       margin: data.margin || null,
       suppliers: {
         connect: supplierIds.map((id) => ({ id })),
       }
     },
   });
 
   console.log(product,'product from server');
   // redirect("/admin/prodcuts")
   if (product) {
 
     revalidatePath('/admin/products')
     return response({
       success: true,
       code: 201,
       message: "Product created successfully",
     });
   }
 } catch (error) {
  console.log(error,'unkwnon');
  
  return response({
    success: false,
  
    error: {
      code: 500,
      message: "Unknown error occurred",
    },
  });
 }
};


