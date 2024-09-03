"use client";

import Image from "next/image";
import { useCartStore } from "../../hooks/useCartStore";

import React from 'react'

const CartModel = () => {

    const { cart, isLoading,subTotal, removeItem } = useCartStore()
    
    const handleCheckout = async () => {
        try {
          const response = await fetch("/api/checkout", {
            method: "POST",
          });
    
          const data = await response.json();
          if (response.ok && data.redirectUrl) {
            window.location.href = data.redirectUrl;
          }
        } catch (err) {
          console.log("Checkout error:", err);
        }
      };
    


      

  return (
    <>
      <div className="w-max absolute p-4 rounded-md shadow-[0_3px_10px_rgb(0,0,0,0.2)] bg-white top-12 right-0 flex flex-col gap-6 z-20">
      {!cart || cart.length === 0 ? (
        <div className="">Cart is Empty</div>
      ) : (
        <>
          <h2 className="text-xl">Shopping Cart</h2>
          {/* LIST */}
          <div className="flex flex-col gap-8">
            {cart.map((item) => (
              <div className="flex gap-4" key={item.id}>
                {/* {item.product.image && (
                  <Image
                    src={item.product.image }
                    alt=""
                    width={72}
                    height={96}
                    className="object-cover rounded-md"
                  />
                )} */}
                <div className="flex flex-col justify-between w-full">
                  {/* TOP */}
                  <div className="">
                    <div className="flex items-center justify-between gap-8">
                      <h3 className="font-semibold">
                        {item.product.name}
                      </h3>
                      <div className="p-1 bg-gray-50 rounded-sm flex items-center gap-2">
                        {item.quantity && item.quantity > 1 && (
                          <div className="text-xs text-green-500">
                            {item.quantity} x{" "}
                          </div>
                        )}
                        ${item.variant.salePrice}
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">
                      {item.status}
                    </div>
                  </div>
                  {/* BOTTOM */}
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Qty. {item.quantity}</span>
                    <span
                      className="text-blue-500"
                      style={{ cursor: isLoading ? "not-allowed" : "pointer" }}
                      onClick={() => removeItem(item.id)}
                    >
                      Remove
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {/* BOTTOM */}
          <div className="">
            <div className="flex items-center justify-between font-semibold">
              <span className="">Subtotal</span>
              <span className="">${subTotal}</span>
            </div>
            <p className="text-gray-500 text-sm mt-2 mb-4">
              Shipping and taxes calculated at checkout.
            </p>
            <div className="flex justify-between text-sm">
              <button className="rounded-md py-3 px-4 ring-1 ring-gray-300">
                View Cart
              </button>
              <button
                className="rounded-md py-3 px-4 bg-black text-white disabled:cursor-not-allowed disabled:opacity-75"
                disabled={isLoading}
                onClick={handleCheckout}
              >
                Checkout
              </button>
            </div>
          </div>
        </>
      )}
    </div>
    </>
  )
}

export default CartModel
