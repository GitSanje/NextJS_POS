"use client";
import React, { useState } from "react";
import ProductImages from "./ProductImages";
import CustomizeProducts from "./CustomizedProducts";
import AddCart from "../Cart/AddCart";

import { ProductOneType,productVariantType } from "@/types";
import { useSession } from "next-auth/react";


interface Props {
  product: ProductOneType;
  varients: productVariantType;

  
}
const SingleDisplay: React.FC<Props> = (props) => {
  const { product, varients } = props;
  const product_varients = product?.ProductVariant;


  const [varPriceDiscout, setVarPriceDiscout] = useState<[number, number]>([
    0,
    0,
  ]);
  const discount =

    varPriceDiscout[0] !== 0
      ? varPriceDiscout[0]
      : product?.discount
      ? product?.discount
      : 0;
      

  const salePrice =
    varPriceDiscout[1] > 0 ? varPriceDiscout[1] : product?.salePrice;
  const discountPrice = (salePrice?? 0) - (discount / 100) * (salePrice ?? 0);
  console.log('====================================');
  console.log(varPriceDiscout,salePrice,discount,discountPrice, "from single display");
  console.log('====================================');

  const { data: session} = useSession();
  console.log('====================================');
  console.log(session, 'session');
  console.log('====================================');
  
 const userId = session?.user.id 
  return (
    <>
      {/* IMG */}
      <div className="w-full lg:w-1/2 lg:sticky top-20 h-max">
        <ProductImages mainImage={product?.image } />
      </div>
      {/* TEXTS */}
      <div className="w-full lg:w-1/2 flex flex-col gap-6">
        <h1 className="text-4xl font-medium">{product?.name}</h1>
        <p className="text-gray-500">{product?.description}</p>
        <div className="h-[2px] bg-gray-100" />
        {!discount && product?.salePrice ? (
          <h2 className="font-medium text-2xl">${product.salePrice}</h2>
        ) : (
          <div className="flex items-center gap-4">
            <h3 className="text-xl text-gray-500 line-through">
              ${varPriceDiscout[1]}
            </h3>
            <h2 className="font-medium text-2xl">${discountPrice}</h2>
          </div>
        )}

        <div className="h-[2px] bg-gray-100" />

        {product_varients && product_varients.length  > 0 ? (
          <CustomizeProducts
            quantityInStock={product?.quantityInStock}
            productId={product?.id  }
            variants={varients}
            productOptions={product_varients}
            setVarPriceDiscout={setVarPriceDiscout}
            amount ={discountPrice}
            
          />
        ) : (
          product && 
          <AddCart
       
            productId={product && product.id}
            productVariantIds={[]}
            stockNumber={product?.quantityInStock}
            amount ={discountPrice}
         
           
          />
        )}
      </div>
    </>
  );
};

export default SingleDisplay;
