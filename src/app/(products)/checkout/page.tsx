import React from "react";
import Stripe from "stripe";

import { getServerSession } from "next-auth";
import { authOptions } from "../../api/auth/[...nextauth]/options";

import { prisma } from "@/src/vendor/prisma";
import PaymentForm from "@/src/components/Checkout/PaymentForm";

const page: React.FC = async () => {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  const cartItems = await prisma.cart.findMany({
    where: { userId: userId as string },
    include: {
      product: true,  // Include product details
      variants: {
        include:{
          option:true,
          variant:true
        }
      }
    }
  });
  // Calculate the subtotal
  const subtotal =  cartItems.reduce( (total, item) => {
    let var_opt;
    if(item.variants.length > 0 && item.status ==="PENDING"){
       item.variants.map((var_product) => {
        if(var_product.variant.name === "Size"){
          var_opt = var_product.salePrice
        }
        var_opt = var_product.salePrice
      })
    }
    
    const price = var_opt !== undefined ? var_opt :
    item.variants.length==0 &&item.status==="PENDING" ?item.product?.salePrice ?? 0: 0 ;

   
    
    return total + (price * (item.quantity || 0))
  },0)

  
  
  // const carts = await getCarts(userId);
  // console.log(carts);
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
  const paymentIntent = await stripe.paymentIntents.create({
    amount: subtotal? subtotal : 50 ,
    currency: "USD",
    // metadata: { productId: product.id },
  });
  if (paymentIntent.client_secret == null) {
    throw Error("Stripe failed to create payment intent");
  }

  return (
    <>
      <PaymentForm
        session={session}
        clientSecret={paymentIntent.client_secret}
      />
    </>
  );
};

export default page;
