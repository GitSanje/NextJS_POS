import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
import { NextResponse, NextRequest } from "next/server";

export async function POST(req: NextRequest) {
    const payload = await req.text();

    const res = JSON.parse(payload);

    const sig = req.headers.get("Stripe-Signature");

}