
import SingleDisplay from "@/components/Product/SingleDisplay";
import { getallOptions, getallVarients, productgetById } from "@/lib/dal";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";
import React, { useState } from "react";

import { Cart, User,Product, ProductVariant, VariantOption, Variant, Tax ,Order} from "@prisma/client";
import { ProductOneType, productVariantType } from "@/types";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";

type Params = Promise<{ slug: string }>



const page = async ({
  params,
}: { params: Params }) => {
  const { slug } = await params;
  const product:ProductOneType = await productgetById(slug);
  const varients:productVariantType = await getallVarients();
  const session = await getServerSession(  authOptions)
  console.log('====================================');
  console.log(session?.user.id);
  console.log('====================================');
  // console.log('====================================');
  // console.log("product: "+ JSON.stringify(product, null, 2),"variants: "+ JSON.stringify(varients, null, 2));
  // console.log('====================================');


  if (!product && ! varients && !session) {
    // return notFound();
    return notFound();
  }
   


  
  const discount = product?.discount ? product.discount : 0;
  const salePrice = product?.salePrice ? product.salePrice : 0;
  const discountPrice = salePrice - (discount / 100) * salePrice;


 
  return (
    <>
    {
      session &&
      <div className="px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64 relative flex flex-col lg:flex-row gap-16">
        <SingleDisplay 
        product={product }
        varients={varients}
        userId= { session?.user.id}
       
       />
      
      </div>
    }
      
    </>
  );
};

export default page;
