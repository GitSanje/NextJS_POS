import { error, log } from "console";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../vendor/prisma";

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("userId");

  try {
    const orders = await prisma.order.findMany({
      where: {
        userId: userId as string,
      },
      include: {
  
        carts: {
          select: {
            quantity: true,
            product: {
              select: {
                id: true,
                name: true,
                salePrice: true,
              },
            },
            variant: {
              select: {
                id: true,
                name: true,
                salePrice: true,
              },
            },
          },
        },
      },
    });

    if (!orders) {
      return NextResponse.json(
        { error: "Orders are not found!" },
        { status: 404 }
      );
    }

    return NextResponse.json({ orders }, { status: 200 });
  } catch (error) {
    console.error("Failed to remove item from cart:", error);
    return NextResponse.json(
      { error: "Failed to get orders " },
      { status: 500 }
    );
  }
}
