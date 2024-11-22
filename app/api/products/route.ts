// app/api/products/route.ts
import { addProduct } from "@/server-actions/product/product";
import { NextResponse } from "next/server";


export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const result = await addProduct(formData);

    return NextResponse.json(result);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, error: "Something went wrong" },
      { status: 500 }
    );
  }
}
