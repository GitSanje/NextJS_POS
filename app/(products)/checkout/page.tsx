import React from "react";
import Stripe from "stripe";

import { getServerSession } from "next-auth";
import { authOptions } from "../../api/auth/[...nextauth]/options";

import { prisma } from "@/vendor/prisma";
import PaymentForm from "@/components/Checkout/PaymentForm";

const page: React.FC = async () => {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  const cartItems = await prisma.cart.findMany({
    where: { userId: userId as string, status:'PENDING' },
    select: {
      amount:true,
      product: {
        select: {
          tax: {
            select: {
              rate:true
            }
          }
        }
      }
    }
  });
  const subTotal = cartItems.length > 0 ?  cartItems.reduce((sum, cart) => {
    return sum + (cart?.amount ?? 0)
   },0 ) : 0

   const totaltax = cartItems.length > 0?  cartItems.reduce((sum, item) => {
    const tax = item.product.tax ? item.product.tax.rate : 0            
    return sum + tax / 100
   },0 ) : 0
  
  
  
  const total = subTotal+ totaltax
  const subTotalInCents = Math.round(total * 100);
  // const carts = await getCarts(userId);
  // console.log(carts);
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
  const paymentIntent = await stripe.paymentIntents.create({
    amount: subTotalInCents> 0? subTotalInCents : 50 ,
    currency: "USD",
    // metadata: { productId: product.id },
  });
  if (paymentIntent.client_secret == null) {
    throw Error("Stripe failed to create payment intent");
  }



  return (

    <>
        {cartItems.length > 0 ?
      <PaymentForm
        session={session}
        clientSecret={paymentIntent.client_secret}
        
      />

      :
      <div className="text-xl">
          No carts are found, please place itmes in cart and proced to checkout
        </div>}
        </>
  );
};

export default page;
