import { generateInvoiceId } from "@/lib/utils";
import { prisma } from "@/vendor/prisma";
import { NextResponse,NextRequest } from "next/server";


export async function POST(req: NextRequest) {
  try {
    const { orderId, totalAmount } = await req.json();

    // Validate incoming data
    if (!orderId || !totalAmount) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    // Create SalesInvoice in the database
    const newInvoice = await prisma.salesInvoice.create({
      data: {
        orderId,
        totalAmount,
        InvoiceId: generateInvoiceId()
       
      },
    });

    // Return success response
    return NextResponse.json({ success: true, invoice: newInvoice });
  } catch (error) {
    console.error("Error creating invoice:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
