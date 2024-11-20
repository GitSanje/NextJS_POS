"use client";

import { forwardRef, useState, useTransition } from "react";

import {
  Elements,
  LinkAuthenticationElement,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import khalti_icon from "../Assets/Khalti_Logo_Color.png";
import cash_icon from "../Assets/cash.png";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import Image from "next/image";
import { useFormState, useFormStatus } from "react-dom";
import { checkout } from "../../server-actions/checkout/checkout";

import { Session } from "next-auth";

import {
  cityOptions,
  formFields,
  stateOptions,
} from "@/src/data/checkoutFormData";
import FormInput from "../form/FormInput";
import { useForm , SubmitHandler, SubmitErrorHandler} from "react-hook-form";
import { checkoutSchema } from "@/src/server-actions/checkout/definitions";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { SelectModel } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/Spinner";
import { useCartStore } from "@/src/hooks/useCartStore";
import { useRouter } from "next/navigation";

import { Card, CardContent, CardDescription } from "@/components/ui/card";
import useGloabalContext from "@/src/context/GlobalProvider";
import SalesInvoice from "../Invoice/SaleInvoice";

interface Props {
  session: Session | null;

}

const CheckoutForm: React.FC<Props> = (props) => {
 
 
  const router = useRouter();
  const { session } = props;
  const [stripeError, setStripeError] = useState<string>("");
  const stripe = useStripe();
  const elements = useElements();
  const { setOrder,order,handleGeneratePdf,cartDetails} = useGloabalContext()
  const {subTotal, totaltax } = cartDetails

  console.log('====================================');
          console.log(order,'invoicedatafrom checkout');
          console.log('====================================');

  type checkoutType = z.infer<typeof checkoutSchema>;
  const [isPending, startTransition] = useTransition();
  const [email, setEmail] = useState<string>("");
  const form = useForm<checkoutType>({
    resolver: zodResolver(checkoutSchema),
    mode: "onChange",
    defaultValues: {
      name: session?.user?.name ?? "",
      phone: session?.user?.phone ?? "",
      email: session?.user?.email ?? "",
      streetaddress: "",
      state: "",
      city: "",
      paymentMethod: undefined
    },
  });
   

  
  const selectedPaymentMethod = form.watch("paymentMethod");


  const onSubmit = async (values: checkoutType) => {
  
    const formData = new FormData();
   
    // Convert and append all entries to FormData
    for (const [key, value] of Object.entries(values)) {
    
      formData.append(key, value as string);
    }


    const handleCheckout = async () => {
      await checkout(formData)
        .then((data) => {
          if (!data) return;

          if (!data.success) {
           
            return toast.error(data.error.message);
          }
    
          setOrder(data.data)
          
         
           
          
          // if(pdfRef.current){
          //   handleGeneratePdf(pdfRef.current,data.data.InvoiceId)
          // }
          setTimeout(() => {
            toast.success(data.message+"\n There will be invoice sent to your email ", 
              { autoClose: 3000 });
            router.push("/order");
          }, 2000);

          
        })
        .catch((error) => {
          console.log(error);

          toast.error("Something went wrong.", {
            autoClose: 2000,
          });
        });
    };

    // Handle different payment methods
    if (selectedPaymentMethod === "cash") {
      
      
      startTransition(handleCheckout);
    } else {
      if (!stripe || !elements || !email) return;

      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${process.env.NEXT_PUBLIC_SERVICE_URL}/stripe/success`,
        },
      });

      if (error) {
        const errorMessage =
          error.type === "card_error" || error.type === "validation_error"
            ? error.message
            : "An unknown error occurred";
        setStripeError(errorMessage);
      } else {
        startTransition(handleCheckout);
      }
    }
  };

 
  return (
    <div className="container mx-auto flex flex-col items-center justify-center">

      
        <>
          <h2 className=" text-xl font-bold text-center mb-4">
            Delivery Address
          </h2>
          <Form {...form}>

            <form
              //  ref={formRef}
              // action={checkoutaction}
              onSubmit={form.handleSubmit(onSubmit)}
            >
               
              <fieldset disabled={isPending} className="group">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  

                
                 
                    
                  {formFields.map((field,index) => (
                    <FormInput
                      key={index}
                      control={form.control}
                      name={field.name as string}
                      label={field.label}
                      type={field.type}
                      placeholder={field.placeholder}
                      isPending={isPending}
                    />
                  ))}

                  {/* State Select */}

                  <SelectModel
                    control={form.control}
                    name="state"
                    options={stateOptions}
                    isPending={isPending}
                    label="State"
                    defaultValue="Select a state"
                  />
                  <SelectModel
                    control={form.control}
                    name="city"
                    options={cityOptions}
                    isPending={isPending}
                    label="City"
                    defaultValue="Select a city"
                  />
                  <div className="form-check">
                    <FormInput
                      control={form.control}
                      name="paymentMethod"
                      label="Cash On Delivery"
                      value="cash"
                      type="radio"
                      isPending={isPending}
                    />
                    <label className="form-check-label" htmlFor="cash">
                      <Image
                        src="/cash.png"
                        alt="Cash"
                        width={80}
                        height={80}
                        style={{ marginRight: "10px" }}
                      />{" "}
                    </label>
                  </div>

                  <div className="form-check">
                    <FormInput
                      control={form.control}
                      name="paymentMethod" // Same name for both radios
                      label="Online payment"
                      value="online" // Value for the "online" option
                      type="radio"
                      isPending={isPending}
                    />
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
                </div>

                {selectedPaymentMethod === "online" && (
                  <>
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
                  </>
                )}

                <div className="mt-8 space-x-6 text-center mb-5">
                  <Button
                    type="submit"
                    className="inline-flex items-center justify-center rounded bg-indigo-500 px-12 py-4 text-sm font-medium text-white hover:bg-indigo-600 group-disabled:pointer-events-none"
                  >
                    <Spinner className="absolute h-4 group-enabled:opacity-0" />
                    <span className="group-disabled:opacity-0">
                      Checkout - ${subTotal + totaltax}
                    </span>
                  </Button>
                </div>
              </fieldset>
            </form>
          </Form>

          { order &&  <SalesInvoice hidden={true} />}
        </>
  
      
      
    </div>
  );
};

export default CheckoutForm;
