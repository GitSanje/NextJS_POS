"use client";

import React, { useEffect, useState } from "react";
import { ShoppingCart, X, Plus, Minus } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetDescription,
} from "@/components/ui/sheet";
import { ScrollArea, ScrollBar } from "../ui/scrollarea";
import { z } from "zod";
import Image from "next/image";
import { productType } from "@/types/productType";
import { CartItem } from "@/types/orderType";
import Link from "next/link";
import { Button } from "../ui/button";
import useGloabalContext from "@/context/GlobalProvider";


// Zod schemas
const ProductSchema = z.object({
  id: z.string(),
  name: z.string(),
  saleprice: z.number(),
  image: z.string(),
  category: z.string(),
});

const CartItemSchema = ProductSchema.extend({
  quantity: z.number(),
});

type ShopSectionProps = {
  isMobile?: boolean;
  products: productType[];
  categories: string[];
};
const ShopSection = ({
  isMobile = false,
  products,
  categories,
}: ShopSectionProps) => {

  const {orderSummary} =useGloabalContext();
  const { cart, setCart,setCartItems} = orderSummary
  
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");

 
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
  };

  const totalItems = Object.values(cart).reduce((sum, count) => sum + count, 0);

  const cartItems: CartItem[] = Object.entries(cart).map(([id, quantity]) => {
    const product = products.find((p) => p.id === id);
  
    if (!product) {
      throw new Error(`Product with id ${id} not found`);
    }
  
    return { 
      product: product as productType, 
      quantity 
    };
  });
  console.log('====================================');
  console.log(cartItems,'cartitems from shopsection');
  console.log('====================================');

  useEffect(() => {
    const derivedCartItems: CartItem[] = Object.entries(cart).map(([id, quantity]) => {
      const product = products.find((p) => p.id === id);

      if (!product) {
        throw new Error(`Product with id ${id} not found`);
      }

      return {
        product: product as productType,
        quantity,
      };
    });

    setCartItems(derivedCartItems);
    if (global?.window !== undefined) {
      localStorage.setItem("cartItemsData", JSON.stringify(derivedCartItems));

    }

  }, [cart, products, setCartItems]);
  
  
  const totalPrice = cartItems.reduce((sum, item) => {
    const productPrice =
      item.variants && item.variants?.length > 0
        ? item.variants.find((var_p) => var_p.variant.name === "Size")
            ?.salePrice || item.product?.salePrice
        : item.product?.salePrice;
    return sum + item.quantity * (productPrice ?? 0);
  }, 0);

  const filteredProducts =
    selectedCategory === "All"
      ? products
      : products?.filter(
          (product) => product?.category.categoryName === selectedCategory
        );

  return (
    <div
      className={`container mx-auto px-2 pb-4 ${
        isMobile ? "h-full overflow-y-auto" : ""
      }`}
    >
      <header className="mb-4 p-2 sticky top-0 z-20 bg-white/40 rounded-md backdrop-blur-md">
        {isMobile ? (
          <>
            <div className="flex items-center justify-center mb-2 ">
              <h2 className="text-lg font-bold">SHOP</h2>
            </div>
            <div
              className="absolute left-2 top-2 cursor-pointer"
              onClick={() => setIsCartOpen(true)}
            >
              {totalItems > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-2 -right-2"
                >
                  {totalItems}
                </Badge>
              )}
              <ShoppingCart className="w-6 h-6" />
            </div>
          </>
        ) : (
          <div className="absolute top-8 right-4 z-20">
            <div
              className="relative cursor-pointer"
              onClick={() => setIsCartOpen(true)}
            >
              <ShoppingCart className="w-6 h-6" />
              {totalItems > 0 && (
                <Badge variant="destructive">{totalItems}</Badge>
              )}
            </div>
          </div>
        )}
        <nav className="w-full">
          <ScrollArea className="w-full">
            <div className="flex space-x-2 pb-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={
                    selectedCategory === category ? "default" : "outline"
                  }
                  size="sm"
                  className={`text-xs whitespace-nowrap ${
                    selectedCategory === category
                      ? "font-semibold text-white"
                      : "text-black"
                  }`}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Button>
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </nav>
      </header>

      <main>
        <div
          className={`grid ${
            isMobile
              ? "grid-cols-2"
              : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
          } gap-2 sm:gap-4`}
        >
          {filteredProducts?.map((product) => {
            const productPrice = product.salePrice ?? 0;
            const discount = product.discount ? product.discount : 0;

            const finalPrice =
              discount > 0
                ? (productPrice - (discount / 100) * productPrice).toFixed(2)
                : productPrice.toFixed(2);

            return (
              <div
                key={product?.id}
                className="border rounded-lg overflow-hidden bg-white text-black shadow-sm "
              >

              <Link
            href={"/products/" + product.id}
            // className="w-full flex flex-col gap-4 sm:w-[45%] lg:w-[22%]"
            key={product.id}
          >
                <div
                  className={`relative overflow-hidden ${
                    isMobile ? "h-24" : "sm:h-48 h-40"
                  }`}
                >
                  {product?.image && (
                    <Image
                      src={product?.image}
                      alt={product.name}
                      fill
                      className="absolute object-cover rounded-md hover:scale-110 transition-transform duration-300 object-contain"
                      unoptimized
                      loading="lazy"
                       sizes="25vw"
                    />
                  )}
                </div>
                <div className="p-2 flex flex-col gap-2">
                  <h3 className="font-semibold text-lg sm:text-sm mb-1 truncate">
                    {product?.name}
                  </h3>
                  <div className="flex gap-2 ">
                    <p
                      className={`text-gray-600 text-sm mb-1 ${
                        discount > 0 ? "line-through" : ""
                      }`}
                    >
                      ${product?.salePrice && product?.salePrice.toFixed(2)}
                    </p>

                    {discount && discount > 0 ? (
                      <div className="flex  flex-grow">
                        <p className="text-gray-600 text-sm mb-1 flex ">
                          ${finalPrice}
                          <span className="text-gray-500 text-sm font-semibold ml-2">
                            %{discount} off{" "}
                          </span>
                        </p>
                      </div>
                    ) : (
                      ""
                    )}
                  </div>

                  <div className="flex gap-4">
                    <Button
                      className="w-full text-xs bg-indigo-500 text-white hover:bg-indigo-700 hover:text-white"
                      size="sm"
                      variant="ghost"
                    >
                      <Link href={`/buy-now/${product.id}`}>
                      Buy Now
                      </Link>
                     
                    </Button>

                    <Button
                      onClick={() => addToCart(product?.id)}
                      className="w-full text-xs"
                      size="sm"
                     
                    >
                      Add to Cart
                      {cart[product.id] && (
                        <Badge variant="secondary" className="ml-1 text-xs">
                          {cart[product?.id]}
                        </Badge>
                      )}
                    </Button>
                  </div>
                </div>
                </Link>
              </div>

             
            );
          })}
        </div>
      </main>

      {/* Cart sheet */}
      <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
        <SheetContent
          className={`w-full ${isMobile ? "sm:max-w-[100vw]" : "sm:max-w-lg"}`}
        >
          <SheetHeader>
            <SheetTitle>Your Cart</SheetTitle>
            <SheetDescription>
              Review your items, adjust quantities, or proceed to checkout.
            </SheetDescription>
          </SheetHeader>
          <ScrollArea
            className={`flex-grow mt-4 ${
              isMobile ? "h-[calc(100vh-250px)]" : "h-[calc(100vh-200px)]"
            }`}
          >
            {cartItems.length === 0 ? (
              <p className="text-center text-gray-500">Your cart is empty.</p>
            ) : (
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div
                    key={item.product?.id}
                    className="flex items-center space-x-4"
                  >
                    {item.product?.image && (
                      <Image
                        src={item.product?.image}
                        alt={item.product.name}
                        width={64}
                        height={64}
                        className="object-cover rounded"
                        unoptimized
                        loading="lazy"
                      />
                    )}
                    <div className="flex-grow">
                      <h4 className="font-semibold">{item.product?.name}</h4>
                      <p className="text-sm text-gray-500">
                        $
                        {item.product?.salePrice &&
                          item.product?.salePrice.toFixed(2)}{" "}
                        x {item.quantity}
                      </p>
                      <p className="text-sm font-semibold">
                        Total: $
                        {item.product?.salePrice &&
                          (item.product?.salePrice * item.quantity).toFixed(2)}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                        {
                            item.product && 
                            <Button
                            size="icon"
                            variant="outline"
                            onClick={() => removeFromCart(item.product?.id )}
                            aria-label={`Decrease quantity of ${item.product.name}`}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                        }
                     
                      <span className="w-8 text-center">{item.quantity}</span>
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => addToCart(item.product?.id)}
                        aria-label={`Increase quantity of ${item.product?.name}`}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
          <SheetFooter className="mt-4">
            <div className="w-full">
              <div className="flex justify-between items-center mb-4">
                <span className="font-semibold">Total:</span>
                <span className="font-semibold text-lg">
                  ${totalPrice.toFixed(2)}
                </span>
              </div>

              <Link href={'/checkout'}>
          
              <Button
                className="w-full"
                disabled={cartItems.length === 0}
                // onClick={() => alert("Proceeding to checkout")}
              >
                Checkout
              </Button>
              </Link>
            </div>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default ShopSection;