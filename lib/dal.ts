
import "server-only";
import { cache } from "@/lib/cache";
const { prisma } = await import("../vendor/prisma");
const { getServerSession } = await import("next-auth");
const { authOptions } = await import("../app/api/auth/[...nextauth]/options");


const { redirect } = await import("next/navigation");

// export const verifySession = cache(async () => {
//   const session = await getServerSession(authOptions);

//   if (!session?.user?.id) {
//     redirect("/api/auth/signin");
//   }

//   return { isAuth: true, userId: session?.user.id };
// });

export const productgetById =  cache (async (id: string)=> {
  try {
    const product  = await prisma.product.findUnique({
      where: {
        id: id,
      },
      include: {
        category: {
          select: {
            categoryName:true
          }
        },
        tax: {
          select: {
            rate:true
          }
        },
        ProductVariant: {
          include: {
            variant: true,
            option: true,
            
          },

        },
      },
    });

    if (product) {
      return product;
    }
  } catch (error) {
    console.log(error, "Failed to fetch product");
    return null;
  }
},
['productgetById'],
{ revalidate: 60*60}
);

export const getallOptions = cache (async () => {
  try {
    const options = await prisma.variantOption.findMany({
      include: {
        variant: true,
      },
    });

    if (options) {
      return options;
    }
  } catch (error) {
    console.log(error, "Failed to fetch options");
    return null;
  }

}, ["getallOptions"], { revalidate: 60*60})
export const getallVarients = cache (async () => {
  try {
    const variants = await prisma.variant.findMany({
      select: {
        name: true,
        options:true
      },
    });

    if (variants) {
      return variants;
    }
  } catch (error) {
    console.log(error, "Failed to fetch options");
    return null;
  }
}, ["getallVarients"],{ revalidate: 60*60} )
