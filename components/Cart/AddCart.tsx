"use client";

import { useCartStore } from "@/hooks/useCartStore";
import { useState } from "react";
import {  notFound, useRouter } from 'next/navigation'
import React from "react";
import useGloabalContext from "@/context/GlobalProvider";

const AddCart = ({

  productId,
  productVariantIds,
  stockNumber,
  amount,
}: {

  productId: string;
  productVariantIds: (string | undefined)[];
  stockNumber: number | undefined;
  amount: number;
}) => {
  const [quantity, setQuantity] = useState(1);
  const { addItem, isLoading } = useCartStore();
  const { userId} = useGloabalContext()
  console.log('====================================');
  console.log(userId, 'add cart');
  console.log('====================================');
  

 if(!userId){

  return notFound()
 }

  // const router = useRouter()
  const handleQuantity = (type: "i" | "d") => {
    if (type === "d" && quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
    if (type === "i" && quantity < (stockNumber ?? 0)) {
      setQuantity((prev) => prev + 1);
    }
  };

  return (
    <>
      <div className="flex flex-col gap-4">
        <h4 className="font-medium">
          Choose a Quantity {isLoading ? "true" : "false"}
        </h4>
        <div className="flex justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-gray-100 py-2 px-4 rounded-3xl flex items-center justify-between w-32">
              <button
                className="cursor-pointer text-xl disabled:cursor-not-allowed disabled:opacity-20"
                onClick={() => handleQuantity("d")}
                disabled={quantity === 1}
              >
                -
              </button>
              {quantity}
              <button
                className="cursor-pointer text-xl disabled:cursor-not-allowed disabled:opacity-20"
                onClick={() => handleQuantity("i")}
                disabled={quantity === stockNumber}
              >
                +
              </button>
            </div>
            {(stockNumber ?? 0) < 1 ? (
              <div className="text-xs">Product is out of stock</div>
            ) : (
              <div className="text-xs">
                Only{" "}
                <span className="text-orange-500">
                  {(stockNumber ?? 0) - quantity} items
                </span>{" "}
                left!
                <br /> {"Don't"} miss it
              </div>
            )}
          </div>
          {productVariantIds && productVariantIds?.length > 0 ? (
            <button
              onClick={() =>
                addItem( userId, quantity, productId, amount, productVariantIds)
              }
              disabled={!isLoading}
              className="w-36 text-sm rounded-3xl ring-1 ring-indigo-500 text-indigo-500 py-2 px-4 hover:bg-indigo-500 hover:text-white disabled:cursor-not-allowed disabled:bg-pink-200 disabled:ring-0 disabled:text-white disabled:ring-none"
            >
              Add to Cart
            </button>
          ) : (
            <button
              onClick={() =>
                addItem(
               
                  userId,
                  quantity,
                  productId,
                  amount,
                  productVariantIds,
             
                )
              }
              disabled={!isLoading}
              className="w-36 text-sm rounded-3xl ring-1 ring-indigo-500 text-indigo-500 py-2 px-4 hover:bg-indigo-500 hover:text-white disabled:cursor-not-allowed disabled:bg-pink-200 disabled:ring-0 disabled:text-white disabled:ring-none"
            >
              Add to Cart
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default AddCart;
