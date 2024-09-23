"use client"
import React from "react";
import {
  Elements,
  LinkAuthenticationElement,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutForm from "./Checkout";

type CheckoutFormProps = {
  clientSecret: string;
  session: any;
};

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY as string
);
const PaymentForm: React.FC<CheckoutFormProps> = (props) => {
  const { session, clientSecret } = props;
  return (
    <>
      <Elements options={{ clientSecret }} stripe={stripePromise}>
        <CheckoutForm session={session} />
      </Elements>
    </>
  );
};

export default PaymentForm;
