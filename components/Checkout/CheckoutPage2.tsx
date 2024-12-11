"use client";

import React, { useEffect, useState } from "react";
import {
  Controller,
  SubmitErrorHandler,
  SubmitHandler,
  useForm,
} from "react-hook-form";
import { useTransition } from "react";
import {
  CardElement,
  useStripe,
  useElements,
  PaymentElement,
} from "@stripe/react-stripe-js";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";

import { Session } from "next-auth/core/types";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  checkoutSchema,
  checkoutType,
} from "@/server-actions/checkout/definitions";
import Image from "next/image";
import { FormInput } from "./form-input";
import { z } from "zod";
import { SpinningButton } from "../ui/spinning-button";

import convertToSubcurrency from "@/lib/utils";
import { checkout } from "@/server-actions/checkout/checkout";
import { toast } from "sonner";
import useGloabalContext from "@/context/GlobalProvider";

import { khaltiPayloadType } from "@/app/api/khalti/route";

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
  const [khaltiPayload, setKhaltiPayload] = useState<khaltiPayloadType | null>(
    null
  );
  const { orderSummary } = useGloabalContext();
  const { cartItems } = orderSummary;

  const stripe = useStripe();
  const elements = useElements();
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
    const handleCheckout = async () => {
      try {
        const data = await checkout(values, cartItems, total);
        if (!data) return;

        if (!data.success) {
          toast.error(data.error.message);
          return;
        }

        // // Display success message
        // toast.success("Order placed successfully!");
        const payload = {
          amount: convertToSubcurrency(data.data?.amount!),
          purchase_order_id: data.data?.id!,
          purchase_order_name: data.data?.productName!,
          customer_info: {
            name: session.user.name!,
            email: values.email,
            phone: values.phone,
          },
        };
        console.log(payload, "payload from khalti");
        // sending data to emailqueue
        try {
          const invoiceData = {
            orderId: data.data?.id!,
            amount: total,
          };

          const response = await fetch("/api/add-to-queue", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(invoiceData),
          });

          if (!response.ok) {
            console.error(
              "Failed to add to email queue",
              response.status,
              response.statusText
            );
            toast.error("Failed to process invoice");
            // Optionally, you might want to continue or return here
          }
        } catch (emailQueueError) {
          console.error("Error adding to email queue:", emailQueueError);
        }
        localStorage.removeItem("cartItems")
        localStorage.removeItem("cartItemsData")

        setKhaltiPayload(payload as khaltiPayloadType);
        if (selectedPaymentMethod === "khalti") {
          await handleKhaltiPayment(payload);
        }

       
      } catch (error) {
        console.error(error);
        toast.error("Something went wrong.");
      }
    };

    if (selectedPaymentMethod === "khalti") {
      startTransition(async () => {
        handleCheckout();
      });
    } else {
      startTransition(() => {
        handleCheckout();
      });
    }
  };

  const handleKhaltiPayment = async (payload: khaltiPayloadType) => {
    try {
      const response = await fetch("/api/khalti", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to create Khalti payment intent");
      }

      const data = await response.json();

      //  window.location.href = data.response.payment_url;
      if (data?.response.payment_url) {
        // Redirect user to the Khalti payment page
        window.location.href = data.response.payment_url;
       
        console.log(data?.px);
      
      } else {
        console.error("No payment URL received from server", data);
      }
    } catch (error) {
      console.error("Error during payment initiation:", error);
      toast.error("Failed to initiate payment. Please try again.");
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
            <Label htmlFor="email">Phone</Label>
            <Input
              id="email"
              {...register("phone")}
              placeholder="eg:9833224354"
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
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
              {["khalti", "stripe", "cash"].map((method) => (
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
          {`Pay Rs${total.toFixed(2)}`}
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

// const onSubmit = async (values: checkoutType) => {
//   // const router = useRouter();

//   if (selectedPaymentMethod === "cash") {
//     startTransition(() => {
//       handleCheckout(); // Call inside a synchronous wrapper
//     });
//   } else if (selectedPaymentMethod === "stripe") {
//     if (!stripe || !elements) return;

//     // Submit elements before confirming the payment
//     const elementsSubmitResponse = await elements.submit();
//     if (elementsSubmitResponse.error) {
//       setStripeError(elementsSubmitResponse.error.message!);
//       return;
//     }
//     // const { paymentMethod, error } = await stripe.createPaymentMethod({
//     //   type: "card",
//     //   card: elements.getElement(PaymentElement), // Can use CardElement instead of PaymentElement
//     //   billing_details: {
//     //     name: session?.user?.name || "Anonymous",
//     //     email: session?.user?.email || "email@example.com",
//     //   },
//     // });

//     const { error  } = await stripe.confirmPayment({
//       elements,
//       clientSecret,
//       confirmParams: {
//         return_url: `${process.env.NEXT_PUBLIC_SERVICE_URL}/stripe/success`,

//       },
//     });
//     // Get payment method details first
//     // const { paymentMethod, error } = await stripe.createPaymentMethod({
//     //   elements,
//     //   params: {
//     //     type: 'card'
//     //   },

//     // });
//     // if (paymentMethod) {
//     //   // Extract and log card details
//     //   const { brand, last4, exp_month, exp_year } = paymentMethod.card!;
//     //   console.log(`Card Details: Brand: ${brand}, Last 4: ${last4}, Expiry: ${exp_month}/${exp_year}`);

//       // Step 2: Confirm PaymentIntent
//       // const { error } = await stripe.confirmPayment({
//       //   elements,
//       //   clientSecret,
//       //   confirmParams: {
//       //     payment_method: paymentMethod.id,
//       //     return_url: `${process.env.NEXT_PUBLIC_SERVICE_URL}/stripe/success`,
//       //     // description: "Purchase of goods/services from vendify",
//       //   },
//       // });
//     if (error) {
//       console.log(error);

//       const errorMessage =
//         error.type === "card_error" || error.type === "validation_error"
//           ? error.message
//           : "An unknown error occurred";
//       setStripeError(errorMessage!);
//     } else {

//       // if (paymentMethod) {

//       //   const cardDetails = paymentMethod.card;
//       //   const last4 = cardDetails?.last4;
//       //   const expMonth = cardDetails?.exp_month;
//       //   const expYear = cardDetails?.exp_year;
//       //   const brand = cardDetails?.brand;

//       //   console.log("Card Details:");
//       //   console.log(`Brand: ${brand}`);
//       //   console.log(`Last 4 Digits: ${last4}`);
//       //   console.log(`Expiry: ${expMonth}/${expYear}`);
//       // }

//       startTransition(() => {
//         handleCheckout();
//       });
//     }
//   }
//   else if (selectedPaymentMethod === "khalti"){
//     console.log("from kahlit");

//      startTransition( () => {
//       handleCheckout(); // Call inside a synchronous wrapper

//     });

//   }

//   }
