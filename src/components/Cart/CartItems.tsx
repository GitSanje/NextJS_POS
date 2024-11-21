"use client";
import Image from "next/image";
import { useCartStore } from "../../hooks/useCartStore";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import useGloabalContext from "@/src/context/GlobalProvider";
import { CartType } from "@/src/types";
import { Session } from "next-auth/core/types";

type  cartItemsProps = {
  subtotal: number,
  totaltax: number,
  cart : CartType | undefined
  session: Session | null

}
const CartItems = ({subtotal, totaltax, cart, session}: cartItemsProps)  => {
  const {  counter, removeItem,  isLoading } = useCartStore();


  const handleRemoveItem = (id: string) => {
    // Confirm before removing item
    confirmAlert({
      title: "Confirm",
      message: "Are you sure you want to remove this item from cart?",
      buttons: [
        {
          label: "Yes",
          onClick: () => removeItem(id), // Call removeItemFromCart function if user confirms
        },
        {
          label: "No",
          onClick: () => {}, // Do nothing if user cancels
        },
      ],
    });
  };
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen text-xl">
        Loading...
      </div>
    );
  }
  if (cart?.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen text-xl">
         No Cart Found
      </div>
    );
  }

  
  return (
    <div className="cartitems">
      <div className="w-full">
  <div className="grid grid-cols-8 gap-4 py-4 text-center font-semibold border-b">
    <p>Name</p>
    <p>Variant</p>
    <p>Base Price</p>
    <p>Price</p>
    <p>Discount</p>
    <p>Quantity</p>
    <p>Total</p>
    <p>Remove</p>
  </div>

  {cart?.map((item) => {
    const productPrice =
      (item.variants.length > 0
        ? item.variants.find((var_p) => var_p.variant.name === "Size")?.salePrice ||
          item.product?.salePrice
        : item.product?.salePrice) ?? 0;

    const discount =
      item.variants.length > 0
        ? (item.variants.find((var_p) => var_p.variant.name === "Size")?.discount ?? 0) ||
          (item.product?.discount ?? 0)
        : item.product?.discount ?? 0;

    const finalPrice =
      discount > 0 ? productPrice ?? - (discount / 100) * productPrice : productPrice;

    const discountPrice = discount > 0 ? (discount / 100) * productPrice : 0;

    return (
      <div key={item.id}>
        <div className="grid grid-cols-8 gap-4 py-4 items-center text-center border-b">
          <p>{item.product?.name}</p>
          <p>
            {item.variants.length > 0
              ? item.variants.map((var_product) => var_product.option?.value).join(", ")
              : "No variant"}
          </p>

          <p>${item.product?.salePrice}</p>

          <p>${productPrice}</p>

          <p>${discountPrice}</p>

          <button className="border px-4 py-1">{item.quantity}</button>

          <p>${finalPrice * item.quantity}</p>

          <p>
            <Image
              className="cursor-pointer"
              src="/cart_cross_icon.png"
              width={20}
              height={20}
              onClick={() => {
                handleRemoveItem(item.id);
              }}
              alt="Remove"
            />
          </p>
        </div>
      </div>
    );
  })}
</div>


      <div className="cartitems-down">
        <div className="cartitems-total">
          <h1>Cart Totals</h1>
          <div>
            <div className="cartitems-total-item">
              <p>SubTotal</p>
              <p>$ {subtotal}</p>
            </div>
            <div className="cartitems-total-item">
              <p>Total tax</p>
              <p>$ {totaltax}</p>
            </div>
            <hr />
            <div className="cartitems-total-item">
              <p>Home Delivery</p>
              <p>Free</p>
            </div>
            <hr />
            <div className="cartitems-total-item">
              <h3>Total</h3>
              <h3>$ {subtotal + totaltax}</h3>
            </div>
          </div>
          {session ? (
            counter > 0 ? (
              <Link href="/checkout">
                <button>PROCEED TO CHECKOUT</button>
              </Link>
            ) : (
              <button onClick={() => alert("There are no cart items.")}>
                PROCEED TO CHECKOUT
              </button>
            )
          ) : (
            <Link href="/api/auth/signin">
              <button>PROCEED TO CHECKOUT</button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartItems;
