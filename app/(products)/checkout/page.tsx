import React from "react";
import Stripe from "stripe";

import { getServerSession } from "next-auth";
import { authOptions } from "../../api/auth/[...nextauth]/options";

import { prisma } from "@/vendor/prisma";

import CheckoutPage from "@/components/Checkout/order";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import { Elements } from "@stripe/react-stripe-js";
// import CheckoutPage from "@/components/Checkout/CheckoutPage2";

export const metadata: Metadata = {
  title: "Checkout",
};




const page: React.FC = async () => {
  // const session = await getServerSession(authOptions);
  // const userId = session?.user?.id;
  // const cartItems = await prisma.cart.findMany({
  //   where: { userId: userId as string, status:'PENDING' },
  //   select: {
  //     amount:true,
  //     product: {
  //       select: {
  //         tax: {
  //           select: {
  //             rate:true
  //           }
  //         }
  //       }
  //     }
  //   }
  // });
  // const subTotal = cartItems.length > 0 ?  cartItems.reduce((sum, cart) => {
  //   return sum + (cart?.amount ?? 0)
  //  },0 ) : 0

  //  const totaltax = cartItems.length > 0?  cartItems.reduce((sum, item) => {
  //   const tax = item.product.tax ? item.product.tax.rate : 0            
  //   return sum + tax / 100
  //  },0 ) : 0
  
  
  
  // const total = subTotal+ totaltax
  // const subTotalInCents = Math.round(total * 100);
  // const carts = await getCarts(userId);
  // console.log(carts);
  

  const session = await getServerSession(authOptions)
  if(!session){
    redirect("/auth/login")
  }


  return (

    <>
        {/* {cartItems.length > 0 ?
      <PaymentForm
        session={session}
        clientSecret={paymentIntent.client_secret}
        
      />

      :
      <div className="text-xl">
          No carts are found, please place itmes in cart and proced to checkout
        </div>} */}


<CheckoutPage session={session} />
   
       
        </>
  );
};

export default page;
