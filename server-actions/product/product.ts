"use server";
import { cache } from "@/lib/cache";
import { response } from "@/lib/utils";
import { productSchema } from "@/schemas";
import { prisma } from "@/vendor/prisma";

import fs from "fs/promises";
import { revalidatePath } from "next/cache";
const sanitize = (value: any) => (typeof value === 'string' && value.trim() === '' ? null : value);
const writeImageToDisk = async (image: File) => {
  await fs.mkdir("public/products", { recursive: true });
  const imagepath = `/products/${crypto.randomUUID()}~${image.name}`;
  await fs.writeFile(
    `public${imagepath}`,
    Buffer.from(await image.arrayBuffer())
  );
  return imagepath;
};
function sanitizeString(value: string): string {
  return value.replace(/\0/g, ""); // Remove null bytes
}

export const addProduct = async (payload: FormData) => {
  console.log(payload,'from server');
  

  if(!payload){
    return
  }
  let payloadObject: any = {};

  for (const [key, value] of payload.entries()) {
    try {
      // Remove null bytes from string values
      const cleanedValue = typeof value === 'string' 
        ? value.replace(/\0/g, '').trim() 
        : value;
      
      // Try to parse JSON values, but only for string values
      if (typeof cleanedValue === 'string') {
        try {
          payloadObject[key] = JSON.parse(cleanedValue);
        } catch {
          payloadObject[key] = cleanedValue;
        }
      } else {
        payloadObject[key] = cleanedValue;
      }
    } catch (error) {
      console.error(`Error processing key ${key}:`, error);
      // Skip this entry if it cannot be processed
      continue;
    }
  }

  const validatedFields = productSchema.safeParse(payloadObject);
  console.log(validatedFields.error,payloadObject )
  if (!validatedFields.success) {
    return response({
      success: false,
      error: {
        code: 422,
        message: "invalid fields",
      },
    });
  }
  const data = validatedFields.data;
 
  const imagepath = data.image ?  await writeImageToDisk(data.image as File) : null
  const imageUrl = imagepath ? imagepath : data.imageUrl

  const supplierIds = data.suppliers?.map((sup) => sup.id) || [];

  const categoryId = (
    await prisma.category.findFirst({
      where: { categoryName: data.category as string},
    })
  )?.id!;
  
  // const taxLabel = data.taxRate ? data.taxRate : data.tax
  // const taxName = taxLabel && taxLabel.split("_")[0].trim();
  const taxId = (
    await prisma.tax.findFirst({
      where: { name: data.tax  },
    })
  )?.id!;
  
  const minimalProduct = {
    name: sanitizeString(data.name), // Ensure name is sanitized
    image: sanitizeString(imageUrl!) || null,
    costPrice: data.costPrice ?? 0,
    quantityInStock: data.quantityInStock ?? 0,
    categoryId,
    description: sanitizeString(data.description!) || null,
    validity: sanitizeString(data.validity!) || null,
    discount: data.discount ?? null,
    salePrice: data.salePrice ?? null,
    margin: data.margin ?? null,
    taxId,
    suppliers: {
      connect: supplierIds.map((id) => ({ id })),
    },
  };
  console.log(data, minimalProduct);
    const product = await prisma.product.create({
      data: minimalProduct
    });

    console.log(product, "product created");
    
  // try {
   


  //   if (product) {
  //     revalidatePath("/products");
  //     return response({
  //       success: true,
  //       code: 201,
  //       message: "Product created successfully",
  //       data: product,
  //     });
  //   } else {
  //     return response({
  //       success: false,
  //       error: {
  //         code: 500,
  //         message: "Failed to create product",
  //       },
  //     });
  //   }
  // } catch (error) {
  //   console.log(error);

  //   return response({
  //     success: false,
  //     error: {
  //       code: 500,
  //       message: "Unknown error occurred",
  //     },
  //   });
  // }
};


export const getProducts = cache(
  async () => {
    try {
      const products = await prisma.product.findMany({
        select: {
          id: true,
          name: true,

          description: true,
          quantityInStock: true,
          image:true,

          salePrice: true,
          costPrice: true,
          status: true,
          discount:true,
          category: {
            select: {
              categoryName: true,
            },
          },
        },
      });

      return products;
    } catch (error) {
      console.log(error);

      return null;
    }
  },
  ["/admin/products", "getProducts"],
  { revalidate: 2 }
);
