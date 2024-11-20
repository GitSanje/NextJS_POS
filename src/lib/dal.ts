import "server-only";
const { prisma } = await import("../vendor/prisma");
const { getServerSession } = await import("next-auth");
const { authOptions } = await import("../app/api/auth/[...nextauth]/options");

import { cache } from "react";
const { redirect } = await import("next/navigation");

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
