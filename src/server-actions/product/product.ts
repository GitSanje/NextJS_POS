"use server";
import { response } from "@/lib/utils";
import { productSchema } from "@/src/schemas";
import { prisma } from "@/src/vendor/prisma";
import { z } from "zod";
import fs from "fs/promises";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";


const writeImageToDisk = async (data:any) => {
    const imagepath = `/products/${crypto.randomUUID()}~${data.image.name}`;
    await fs.writeFile(
      `public${imagepath}`,
      Buffer.from(await data.image.arrayBuffer())
    );
    return imagepath;
  };

  
export const addProduct = async (payload: z.infer<typeof productSchema>) => {
  // productSchema.safeParse(Object.fromEntries(formData.entries()))

  const validatedFields = productSchema.safeParse(payload);

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
  const imagepath = await writeImageToDisk(data);


    
  const product = await prisma.product.create({
    data: {
      name: data.name,
      image: imagepath,
      costPrice:parseFloat( data.costPrice),
      quantityInStock: parseFloat(data.quantityInStock),
      categoryId: (
        await prisma.category.findFirst({
          where: { categoryName: "Electronics" },
        })
      )?.id!,
      description: data.description,
      validity: data.validity,
      discount: data.discount,
      salePrice: parseFloat(data.salePrice),
      margin: data.margin,
    },
  });

  // redirect("/admin/prodcuts")
  if (product) {

    revalidatePath('/admin/products')
    return response({
      success: true,
      code: 201,
      message: "Product created successfully",
    });
  }
};
