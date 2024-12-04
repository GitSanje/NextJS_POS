"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ShoppingCart } from "lucide-react";
import ProductCard from "./Item";
import { productType } from "@/types/productType";
import { CartItem } from "@/types/orderType";
import useGloabalContext from "@/context/GlobalProvider";
import { Session } from "next-auth/core/types";
import CheckoutPage2 from "./CheckoutPage2";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import convertToSubcurrency from "@/lib/utils";

export type product = productType & {
  discountV: number;
  finalPrice: number;
  productPrice: number;
};

type Props = {
  session: Session;
};
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY as string
);

export default function CheckoutPage({ session }: Props) {
  const [quantity, setQuantity] = useState<number>(1);
  const { orderSummary } = useGloabalContext();

  const { cartItems, cart } = orderSummary;

  const calculateFinalPrice = (product: productType, quantity: number) => {
    const productPrice = product.salePrice ?? 0;
    const discount = product.discount ? product.discount : 0;

    const finalPrice =
      discount > 0
        ? (productPrice - (discount / 100) * productPrice).toFixed(2)
        : productPrice.toFixed(2);

    return parseFloat(finalPrice) * quantity;
  };

  const subtotal = cartItems.reduce(
    (total, { product, quantity }) =>
      total + calculateFinalPrice(product as productType, quantity),
    0
  );

  const shipping = 5.99;
  const total = subtotal + shipping;

  //     const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
  // const paymentIntent = await stripe.paymentIntents.create({
  //   amount: total ? total : 50 ,
  //   currency: "USD",
  //   // metadata: { productId: product.id },
  // });
  // if (paymentIntent.client_secret == null) {
  //   throw Error("Stripe failed to create payment intent");
  // }

  // Configure Elements instance with manual payment method creation
  const elementsOptions = {
    // Replace with your client secret
    appearance: {
      theme: "stripe", // Customize appearance
    },
    paymentMethodCreation: "manual", // Set manual payment method creation
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Shipping Address</CardTitle>
          </CardHeader>

          <Elements
            stripe={stripePromise}
            options={{
              mode: "payment",
              amount: convertToSubcurrency(total),
              currency: "usd",
            }}
          >
            <CheckoutPage2 total={total} session={session} />
          </Elements>

          <h1 className="text-2xl font-bold mb-6">Packages</h1>
          {cartItems.map((cartItem, index) => (
            <ProductCard key={index} cartItem={cartItem} />
          ))}
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              Order Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            {cartItems.map(({ product, quantity }) => (
              <div
                key={product?.id}
                className="flex justify-between items-center mb-2"
              >
                <span>
                  {product?.name}{" "}
                  <span className="text-sm font-bold">X {quantity}</span>
                </span>
                <span>
                  $
                  {calculateFinalPrice(
                    product as productType,
                    quantity
                  ).toFixed(2)}
                </span>
              </div>
            ))}
            <Separator className="my-4" />
            <div className="flex justify-between items-center mb-2">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span>Shipping</span>
              <span>${shipping.toFixed(2)}</span>
            </div>
            <Separator className="my-4" />
            <div className="flex justify-between items-center font-bold">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
