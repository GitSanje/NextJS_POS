"use client";

import React, { useTransition, useEffect, useState } from "react";
import { ShoppingCart, X, Plus, Minus, Loader2 } from "lucide-react";

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
import { getUserSession } from "@/server-actions/user";
import { toast } from "sonner";
import { addCart, postCarts, removeCart } from "@/server-actions/cart";
import { SpinningButton } from "../ui/spinning-button";
import { Router } from "next/router";
import { useRouter } from "next/navigation";
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
  const { orderSummary,cartFunctions } = useGloabalContext();
  const { cart, setCart, setCartItems,cartItems } = orderSummary;
  const {addToCart,removeFromCart} = cartFunctions

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isPending, startTransition] = useTransition()
  const [ cartId, setCartId]  = useState<string>()
  const [userId, setUserId] = useState<string | undefined>(undefined);
  useEffect(() => {
    const fetchUserId = async () => {
      const sessionId = await getUserSession(); // Call your session fetch function
      setUserId(sessionId); // Update userId in state
    };

    fetchUserId(); // Invoke the function
  }, []);

  
  
  const totalItems = Object.values(cart).reduce((sum, count) => sum + count, 0);

  // const cartItems: CartItem[] = Object.entries(cart).map(([id, quantity]) => {
  //   const product = products.find((p) => p.id === id);

  //   if (!product) {
  //     throw new Error(`Product with id ${id} not found`);
  //   }

  //   return {
  //     id: cartId!,
  //     product: product as productType,
  //     quantity,
  //   };
  // });
  

  useEffect(() => {
    if(cartId){
      const derivedCartItems: CartItem[] = Object.entries(cart).map(
        ([id, quantity]) => {
          const product = products.find((p) => p.id === id);
  
          if (!product) {
            throw new Error(`Product with id ${id} not found`);
          }
  
          return {
            id:cartId,
            product: product as productType,
            quantity,
            
          };
        }
      );
  
      setCartItems(derivedCartItems);
      if (global?.window !== undefined) {
        localStorage.setItem("cartItemsData", JSON.stringify(derivedCartItems));
      }

    }
    
  }, [cart, products, setCartItems, cartId]);

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
     const router = useRouter()
     const addToCartDB = async (productId: string, amount: number, productVariantIds: string[] = []) => {
      startTransition(() => {
        if (userId) {
          addToCart(productId); // Local cart update
    
          // Check if the product is already in the cart
          if (cart[productId] > 0) {
            addCart(productId, amount)
              .then((data) => {
                if (!data) {
                  return toast.error("Something went wrong");
                }
                if (!data.success) {
                  return toast.error(data.error.message);
                }
                toast.success("Product quantity updated successfully!");
              })
              .catch((error) => {
                console.error("Error updating cart:", error);
                toast.error("An unexpected error occurred while updating the cart.");
              });
          } else {
            postCarts(userId, 1, productId, amount, productVariantIds)
              .then((data) => {
                if (!data) {
                  return toast.error("Something went wrong");
                }
                if (!data.success) {
                  return toast.error(data.error.message);
                }
                setCartId(data.data?.id)
                toast.success("Product added to the cart successfully!");
              })
              .catch((error) => {
                console.error("Error adding to cart:", error);
                toast.error("An unexpected error occurred while adding to the cart.");
              });
          }
        } else {
          toast.error("User not logged in. Please log in to add items to the cart.");
        }
      });
    };
    
    

    const removeCartDB = async (productId: string, amount: number) => {
      startTransition(async () => {
        if( userId) {

          removeFromCart(productId);
    
          await removeCart(productId, amount)

           .then((data) => {
            console.log(data, "from data");
            
            if(!data){
              return toast.error("something went wrong");
            }
            if(!data.success){
              return toast.error(data.error.message);
            }
            toast.success("product removed from cart sucsesfully");
           
           })
    
        }
        
      })

    }

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
                  className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center rounded-full text-xs"
                >
                  {totalItems}
                </Badge>
              )}
              <ShoppingCart className="h-6 w-6 text-gray-400 hover:text-gray-500" />
            </div>
          </>
        ) : (
          <div className="absolute top-8 right-4 z-20">
            <div
              className="relative cursor-pointer"
              onClick={() => setIsCartOpen(true)}
            >
              {totalItems > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center rounded-full text-xs"
                >
                  {totalItems}
                </Badge>
              )}
              <ShoppingCart className="h-6 w-6 text-gray-400 hover:text-gray-500" />
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
                <div
                  className={`relative overflow-hidden ${
                    isMobile ? "h-24" : "sm:h-48 h-40"
                  }`}
                >
                  <Link href={"/products/" + product.id} key={product.id}>
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
                  </Link>
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
                      <Link href={"/products/" + product.id} key={product.id}>Buy Now</Link>
                    </Button>

                    <SpinningButton
                    
                      
                    
                      onClick={ userId && product?.id ? () => addToCartDB(product?.id,productPrice)
                        :
                        () => router.push('/auth/login')

                      }
                      className="w-full text-xs"
                      size="sm"
                      isLoading={isPending}
                    >
                      Add to Cart
                      {cart[product.id] && (
                        <Badge variant="secondary" className="ml-1 text-xs">
                          {cart[product?.id]}
                        </Badge>
                      )}
                    </SpinningButton>
                  </div>
                </div>
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
                      {item.product && (
                        <SpinningButton
                          size="icon"
                          variant="outline"
                          onClick={() => removeCartDB(item.product?.id as string, item.product?.salePrice as number)}
                          aria-label={`Decrease quantity of ${item.product.name}`}
                          // isLoading= { isPending}
                        >
                         {
 <Minus className="h-4 w-4" />
                         } 

                        </SpinningButton>
                      )}

                      <span className="w-8 text-center">{item.quantity}</span>
                      <SpinningButton
                        size="icon"
                        variant="outline"
                        onClick={() => addToCartDB(item.product?.id as string, item.product?.salePrice as number)}
                        aria-label={`Increase quantity of ${item.product?.name}`}
                       
                      >
                        <Plus className="h-4 w-4" />
                      </SpinningButton>
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

              <Link href={"/checkout"}>
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
