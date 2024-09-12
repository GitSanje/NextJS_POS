import { prisma } from "@/src/vendor/prisma";

export const getProducts = async () => {
  try {
    const products = await prisma.product.findMany({
      select: {
        id: true,
        name: true,
       
        description: true,
        quantityInStock: true,
      
        salePrice: true,
        costPrice: true,
        status: true,
        category:{
            select:{
                categoryName:true
            }
        }
       
      },
     
    });

    return products
  } catch (error) {
    console.log(error);
    
    return null
  }
};
