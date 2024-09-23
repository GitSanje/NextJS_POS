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
      include: {
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
};

export const getallOptions = async () => {
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

}
export const getallVarients = async () => {
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
}
