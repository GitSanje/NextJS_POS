import "server-only";
import { prisma } from "../vendor/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../app/api/auth/[...nextauth]/options";
import { cache } from "react";
import { redirect } from "next/navigation";

export const verifySession = cache(async () => {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/api/auth/signin");
  }

  return { isAuth: true, userId: session.user.id };
});

export const productgetById = async (id: string) => {
  try {
    const product = await prisma.product.findUnique({
      where: {
        id: id,
      },
      
    });

    if(product){
      return product;
    }
  } catch (error) {
    console.log(error,'Failed to fetch product')
    return null
  }
};
