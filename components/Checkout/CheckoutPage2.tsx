"use client";

import React, { useEffect, useState } from "react";
import {
  Controller,
  SubmitErrorHandler,
  SubmitHandler,
  useForm,
} from "react-hook-form";
import { useTransition } from "react";
import { CardElement, useStripe, useElements, PaymentElement } from "@stripe/react-stripe-js";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Session } from "next-auth/core/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { checkoutSchema, checkoutType } from "@/server-actions/checkout/definitions";
import Image from "next/image";
import { FormInput } from "./form-input";
import { z } from "zod";
import { SpinningButton } from "../ui/spinning-button";

import convertToSubcurrency from "@/lib/utils";
import { checkout } from "@/server-actions/checkout/checkout";
import { toast } from "sonner";
import useGloabalContext from "@/context/GlobalProvider";


type Props = {
  total: number;
  session: Session;
};
const CheckoutPage2 = ({ total, session }: Props) => {
  const form = useForm({
    resolver: zodResolver(checkoutSchema),
    mode: "onChange",
    defaultValues: {
      name: session?.user?.name ?? "",
      phone: session?.user?.phone ?? "",
      email: session?.user?.email ?? "",
      streetaddress: "",
      state: "",
      city: "",
      paymentMethod: undefined,
    },
  });
  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors },
  } = form;

//   type CheckoutSchema = z.infer<typeof checkoutSchema>;

  const [isPending, startTransition] = useTransition();
  const [stripeError, setStripeError] = useState<string>("");
  const [clientSecret, setClientSecret] = useState<string>("");
  const { orderSummary} = useGloabalContext()
  const { cartItems} = orderSummary

    const stripe = useStripe()
    const elements = useElements()
  const selectedPaymentMethod = watch("paymentMethod");

  console.log(selectedPaymentMethod);



  useEffect(() => {
    fetch("http://localhost:3000/api/create-payment-intent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ amount: convertToSubcurrency(total) }),
    })
      .then((res) => res.json())
      .then((data) => setClientSecret(data.clientSecret as string));
  }, [total]);



  const onSubmit = async (values: checkoutType) => {
    // const formData = new FormData();
  
    // // Convert and append all entries to FormData
    // for (const [key, value] of Object.entries(values)) {
    //   formData.append(key, value as string);
    // }
   
  
    const handleCheckout = async () => {
      try {
        const data = await checkout(values,cartItems);
        if (!data) return;
  
        if (!data.success) {
          return toast.error(data.error.message);
        }
      } catch (error) {
        console.error(error);
        toast.error("Something went wrong.");
      }
    };
  
    if (selectedPaymentMethod === "cash") {
      startTransition(handleCheckout);
    } else {
      if (!stripe || !elements) return;
  
      // Submit elements before confirming the payment
      const elementsSubmitResponse = await elements.submit();
      if (elementsSubmitResponse.error) {
        setStripeError(elementsSubmitResponse.error.message !);
        return;
      }
  
      const { error } = await stripe.confirmPayment({
        elements,
        clientSecret,
        confirmParams: {
          return_url: `${process.env.NEXT_PUBLIC_SERVICE_URL}/stripe/success`,
        },
      });
  
      if (error) {
        const errorMessage =
          error.type === "card_error" || error.type === "validation_error"
            ? error.message
            : "An unknown error occurred";
        setStripeError(errorMessage!);
      } else {
        startTransition(handleCheckout);

      }
    }
  };
  


  const onError: SubmitErrorHandler<checkoutType> = (values) => {
    console.log("Form values errors:", values);
  };
  return (
    <div className="pt-4">
      <CardContent>
        <form className="space-y-4" onClick={handleSubmit(onSubmit, onError)}>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" {...register("name")} placeholder="John Doe" />
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                {...register("email")}
                placeholder="john@example.com"
                type="email"
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email.message}</p>
              )}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              {...register("streetaddress")}
              placeholder="123 Main St"
            />
            {errors.streetaddress && (
              <p className="text-red-500 text-sm">
                {errors.streetaddress.message}
              </p>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input id="city" {...register("city")} placeholder="New York" />
              {errors.city && (
                <p className="text-red-500 text-sm">{errors.city.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="state">State</Label>
              <Input id="state" {...register("state")} placeholder="NY" />
              {errors.state && (
                <p className="text-red-500 text-sm">{errors.state.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <Label>Payment Method</Label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {["stripe", "khalti", "cash"].map((method) => (
                <div
                  key={method}
                  className="flex flex-col items-start border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  <span className="font-bold text-lg">
                    {method.charAt(0).toUpperCase() + method.slice(1)}
                  </span>
                  <div className="flex items-center space-x-3 mt-2">
                    <FormInput
                    //   {...register("paymentMethod")}
                      control={control}
                     name="paymentMethod"
                      type="radio"
                      value={method}
                      id={method}
                      
          
                      
                    />

                    <Label
                      htmlFor={method}
                      className="flex items-center space-x-2 cursor-pointer"
                    >
                      <Image
                        src={`/${method}-logo.png`}
                        alt={method}
                        width={200}
                        height={100}
                      />
                    </Label>
                  </div>
                </div>
              ))}
            </div>
            {errors.paymentMethod && (
              <p className="text-red-500 text-sm">
                {errors.paymentMethod.message}
              </p>
            )}
          </div>
          {/* {selectedPaymentMethod === 'stripe' && (
  <div className="space-y-2">
    <Label>Card Details</Label>
    <CardElement options={{style: {base: {fontSize: '16px'}}}} />
  </div>
)} */}

{selectedPaymentMethod === "stripe" && (
                  <>
                   {
                  <Card>
                    {stripeError && (
                      <CardDescription className="text-destructive">
                        {stripeError}
                      </CardDescription>
                    )}

                    <CardContent>
                      <PaymentElement />
                      <div className="mt-4">
                        {/* <LinkAuthenticationElement
                          onChange={(e) => setEmail(e.value.email)}
                        /> */}
                      </div>
                    </CardContent>
                  </Card>
                   } 
                  </>
                )}
        </form>
      </CardContent>
      <CardFooter>
        <SpinningButton
          className="w-full"
          isLoading={isPending}
          onClick={handleSubmit(onSubmit, onError)}
        >
          {isPending ? "Processing..." : `Pay $${total.toFixed(2)}`}
        </SpinningButton>
      </CardFooter>
    </div>
  );
};

export default CheckoutPage2;

// {
/* <RadioGroup {...register('paymentMethod')}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="stripe" id="stripe" />
                <Label htmlFor="stripe">Stripe</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="khalti" id="khalti" />
                <FormInput
                      control={control}
                      name="paymentMethod" // Same name for both radios
                      label="khalti"
                      value="khalti" // Value for the "online" option
                      type="radio"
                      isPending={isPending}
                    />
                <Label htmlFor="khalti">Khalti</Label>
                <label className="form-check-label" htmlFor="khalti">
                      <Image
                        src="/Khalti_Logo_Color.png"
                        alt="Khalti"
                        width={120}
                        height={120}
                        style={{ marginRight: "10px" }}
                      />
                    </label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="cash" id="cash" />
                <Label htmlFor="cash">Cash</Label>
              </div>
            </RadioGroup> */
// }
