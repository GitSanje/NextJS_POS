"use client"
import { useState } from 'react'
import Image from 'next/image'
import { Minus, Plus } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"


import { CartItem } from '@/types/orderType'
import useGloabalContext from '@/context/GlobalProvider'

export default function ProductCard({ cartItem} : {
    cartItem: CartItem
    // setQuantity: (value: number | ((prev: number) => number)) => void;
   
}
) {
  const { product, quantity } = cartItem;
  const { orderSummary } = useGloabalContext()
  const { setCart, cart, setCartItems} = orderSummary

  const updateCartItemQuantity = (productId: string, increment: number) => {
    setCartItems((prevCartData: CartItem[]): CartItem[] => {
      const updatedCartData = prevCartData.map((cartItem) => {
        if (cartItem.product?.id === productId) {
          return {
            ...cartItem,
            quantity: cartItem.quantity + increment,
          };
        }
        return cartItem;
      });
  
      // Update localStorage after updating cart
      localStorage.setItem("cartItemsData", JSON.stringify(updatedCartData));
  return updatedCartData
      
    });
  };



  const addToCart = (productId: string | undefined) => {
   
    if (!productId) {
      return;
    }
    setCart((prevCart) => {
      const prevCarts = { ...prevCart };
      const updatedCarts = {
        ...prevCarts,
        [productId]: (prevCarts[productId] || 0) + 1,
      };

     

      return updatedCarts;
    });

    updateCartItemQuantity(productId, 1)
    
   

  };



  const removeFromCart = (productId: string | undefined) => {
    if(!productId){
        return
    }
    setCart((prevCart) => {
      const newCart = { ...prevCart };
      if (newCart[productId] > 1) {
        newCart[productId]--;
      } else {
        delete newCart[productId];
      }
      return newCart;
    });

    updateCartItemQuantity(productId, -1)
  };
  

  return (
    <Card className="p-4 shadow-sm  ">
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0">
          <Image
            src={product?.image ? product.image : "/placeholder.svg"}
            alt="Product Image"
            width={80}
            height={80}
            className="rounded-lg object-cover"
          />
        </div>
        <div className="flex-grow">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{ product?.name}</h3>
              <p className="mt-1 text-sm text-gray-500">
                    {product?.description}
              </p>
            </div>
            <div className="text-right">
              {/* <div className="text-2xl font-bold text-gray-900">${product.discountV > 0 ?product.finalPrice: product.productPrice  }</div>
              { product.discountV > 0 && <div className={`text-sm text-gray-500 ${product.discountV > 0 ?'line-through':''}`}>${product.productPrice }</div>}
              <div className="text-sm font-medium text-green-600">{product.discountV}% OFF</div> */}
            </div>
          </div>
          <div className="mt-4 flex justify-between items-center">
            <div className="text-sm text-gray-600">In stock</div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="icon"
                onClick={()=> removeFromCart(product?.id)}
                aria-label="Decrease quantity"
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="text-lg font-medium w-8 text-center">{quantity}</span>
              <Button
                variant="outline"
                size="icon"
                onClick={()=> addToCart(product?.id)}
                aria-label="Increase quantity"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}