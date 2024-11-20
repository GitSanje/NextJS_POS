
import SingleDisplay from "@/src/components/Product/SingleDisplay";
import { getallOptions, getallVarients, productgetById } from "@/src/lib/dal";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";
import React, { useState } from "react";

type Params = Promise<{ slug: string }>


const page = async ({
  params,
}: { params: Params }) => {
  const { slug } = await params;
  const product = await productgetById(slug);
  const varients = await getallVarients();
  if (!product && ! varients) {
    // return notFound();
    return null;
  }
   


  const product_varients = product?.ProductVariant;
  const discount = product?.discount ? product.discount : 0;
  const salePrice = product?.salePrice ? product.salePrice : 0;
  const discountPrice = salePrice - (discount / 100) * salePrice;


 
  return (
    <>
      <div className="px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64 relative flex flex-col lg:flex-row gap-16">
        <SingleDisplay 
        product={product }
        varients={varients}
        product_varients={product_varients}
       />
      
      </div>
    </>
  );
};

export default page;
