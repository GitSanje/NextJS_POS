import { NextRequest, NextResponse } from "next/server";

type CustomerInfo = {
  name: string;
  email: string;
  phone: string;
};

export type khaltiPayloadType = {
  amount: number; // or number if it should be numeric
  purchase_order_id: string;
  purchase_order_name: string;
  customer_info: CustomerInfo;
};

type KhaltiResponse = {
  pidx: string;
  payment_url: string;
  expires_at: Date;
  expires_in: number;
};


export async function POST(req: NextRequest) {
  try {
    // Parse the request body
    const data = (await req.json()) as khaltiPayloadType;

    const { amount, purchase_order_id, purchase_order_name, customer_info } = data;

    // Log the incoming data for debugging
    console.log("Received Data:", data);

    // Make the fetch request to Khalti
    const response = await fetch(
      "https://a.khalti.com/api/v2/epayment/initiate/",
      {
        method: "POST",
        headers: {
          Authorization: `key ${process.env.KHALTI_SECRET_KEY!}`, // Ensure ENV variable is properly set
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          return_url: `${process.env.NEXT_PUBLIC_SERVICE_URL}/stripe/success?id=${purchase_order_id}&amount=${amount}`,
          website_url: "http://localhost:3000",
          amount: amount,
          purchase_order_id: purchase_order_id,
          purchase_order_name: purchase_order_name,
          customer_info,
        }),
      }
    );
    console.log(response);

    // Check if the response is successful
    if (response.ok) {
      const responseData: KhaltiResponse = await response.json();
      // Check for the presence of pidx
      if (responseData.pidx) {
        return NextResponse.json(
          { message: "Payment successful", response: responseData },
          { status: 200 }
        );
      }
    }

    // If no pidx found, return a failure response
    return NextResponse.json(
      { message: "Payment failed", error: "pidx not found" },
      { status: 400 }
    );
  } catch (error) {
    // Log the error for debugging
    console.error("Error during processing:", error);

    // Return a generic error response
    return NextResponse.json(
      { message: "An error occurred", error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
