"use client";

import { useCartStore } from "@/hooks/useCartStore";
import { startTransition, useEffect, useState, useTransition } from "react";
import { notFound, useRouter } from "next/navigation";
import React from "react";
import useGloabalContext from "@/context/GlobalProvider";
import { getUserSession } from "@/server-actions/user";
import { Router } from "next/router";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { CartItem } from "@/types/orderType";
import { postCarts } from "@/server-actions/cart";
import { toast } from "sonner";
import { SpinningButton } from "../ui/spinning-button";
import { productType } from "@/types/productType";

const AddCart = ({
  product,
  productId,
  productVariantIds,
  stockNumber,
  amount,
}: {
  product: productType | undefined;
  productId: string;
  productVariantIds: (string | undefined)[];
  stockNumber: number | undefined;
  amount: number;
}) => {
  const { addItem, isLoading } = useCartStore();
  const [isPending, startTransition] = useTransition();

  const { orderSummary, cartFunctions } = useGloabalContext();
  const { cart, setCart, setCartItems, cartItems } = orderSummary;
  const { addToCart, removeFromCart } = cartFunctions;
  const [quantity, setQuantity] = useState(
    cart[productId] ? cart[productId] : 1
  );

  const [userId, setUserId] = useState<string | undefined>(undefined);
  useEffect(() => {
    const fetchUserId = async () => {
      const sessionId = await getUserSession(); // Call your session fetch function
      setUserId(sessionId); // Update userId in state
    };

    fetchUserId(); // Invoke the function
  }, []);

  console.log(productId, stockNumber, cart[productId]);

  const handleCartUpdate = (
    productId: string,
    product: productType,
    quantity: number,
    amount: number,
    productVariantIds: string[]
  ) => {
    addToCart(productId);
    if(!cartItems || cartItems.length ==0){
      const newCartItem = {
        product: product,
        quantity: quantity,
        amount: amount,
        productVariantIds: productVariantIds,
      };
  
      const updatedCartData = [newCartItem];
  
      setCartItems(updatedCartData);
      
      if (global?.window !== undefined) {
        localStorage.setItem("cartItemsData", JSON.stringify(updatedCartData));
      }

    }
    else{
      setCartItems((prevCartData) => {
        const newCartItem = {
          product: product,
          quantity: quantity,
          amount: amount,
          productVariantIds: productVariantIds,
        };

        const updatedCartData = [...prevCartData, newCartItem];

        // Update localStorage after updating cart
        if (global?.window !== undefined) {
          localStorage.setItem(
            "cartItemsData",
            JSON.stringify(updatedCartData)
          );
        }

        return updatedCartData;
      });
    }
    
    // if (productId && cart[productId] > 0) {
    //   setCartItems((prevCartData) => {
    //     const updatedCartData = prevCartData.map((cartItem) => {
    //       if (cartItem.product?.id === productId) {
    //         return {
    //           ...cartItem,
    //           quantity: quantity,
    //           productVariantIds: productVariantIds,
    //           amount: amount,
    //         };
    //       }
    //       return cartItem;
    //     });
  
    //     // Update localStorage after updating cart
    //     if (global?.window !== undefined) {
    //       localStorage.setItem("cartItemsData", JSON.stringify(updatedCartData));
    //     }
  
    //     return updatedCartData; // Return the updated array
    //   });
    // } else if (productId && !cart[productId]) {
   
  
    //}
  };
  
  // console.log(cartItems, "cartItems from the addcart");

  const router = useRouter();
  const handleQuantity = (type: "i" | "d", productId: string) => {
    if (type === "d" && quantity > 1) {
      setQuantity((prev) => prev - 1);
      removeFromCart(productId);
    }
    if (type === "i" && quantity < (stockNumber ?? 0)) {
      setQuantity((prev) => prev + 1);
      addToCart(productId);
    }
  };

  const addToCartDB = async () => {
    
    startTransition(async () => {
      
      if (userId) {
        if(quantity == 0){
          toast.info("please enter the quantity")
          return;
        }
        handleCartUpdate(productId,product as productType, quantity,amount,productVariantIds as string[])
        
        await postCarts(
          userId,
          quantity,
          productId,
          amount,
          productVariantIds
        ).then((data) => {
          if (!data.success) {
            return toast.error(data.error.message);
          }
          toast.success("product added to cart sucsesfully");
          // router.push("/cart-view");
        });
        
      }
    });
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
                onClick={() => handleQuantity("d", productId)}
                disabled={quantity === 1}
              >
                -
              </button>
              {quantity}
              <button
                className="cursor-pointer text-xl disabled:cursor-not-allowed disabled:opacity-20"
                onClick={() => handleQuantity("i", productId)}
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
            <SpinningButton
              onClick={
                userId ? () => addToCartDB() : () => router.push("/auth/login")
              }
              className="w-36 text-xs"
              size="sm"
              isLoading={isPending}
            >
              Add to Cart
              {cart[productId] && (
                <Badge variant="secondary" className="ml-1 text-xs">
                  {cart[productId]}
                </Badge>
              )}
            </SpinningButton>
          ) : (
            <SpinningButton
              onClick={
                userId
                  ? () =>
                      addItem(
                        userId,
                        quantity,
                        productId,
                        amount,
                        productVariantIds
                      )
                  : () => router.push("/auth/login")
              }
              className="w-36 text-xs"
              size="sm"
              isLoading={isPending}
            >
              Add to Cart
              {cart[productId] && (
                <Badge variant="secondary" className="ml-1 text-xs">
                  {cart[productId]}
                </Badge>
              )}
            </SpinningButton>
            // <button

            //   // disabled={!isLoading}
            //   // className="w-36 text-sm rounded-3xl ring-1 ring-indigo-500 text-indigo-500 py-2 px-4 hover:bg-indigo-500 hover:text-white disabled:cursor-not-allowed disabled:bg-pink-200 disabled:ring-0 disabled:text-white disabled:ring-none"
            // >
            //   Add to Cart
            // </button>
          )}
        </div>
      </div>
    </>
  );
};

export default AddCart;
