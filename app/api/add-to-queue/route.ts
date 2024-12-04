
import { addDatatoEmailQueue } from "@/lib/worker";
import { NextRequest, NextResponse } from "next/server";


type postRes = {orderId:string, amount:number}
export async function POST(req: NextRequest) {
    try {
        const {orderId, amount} = await req.json() as postRes
        const invoiceData ={
            orderId:orderId!,
            amount: amount
           }

        await addDatatoEmailQueue(invoiceData)
 

        return NextResponse.json({ success: true });
        

    } catch (error) {
        return NextResponse.json({ success: false });
    }
    
}