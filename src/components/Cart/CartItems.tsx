"use client";
import Image from "next/image";
import { useCartStore } from "../../hooks/useCartStore";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";

const CartItems = () => {
  const { cart, counter, removeItem, subTotal, isLoading } = useCartStore();
  const { data: session } = useSession();

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
  if (counter === 0) {
    return (
      <div className="flex justify-center items-center h-screen text-xl">
        Loading...
      </div>
    );
  }

  return (
    <div className="cartitems">
      <div className="cartitems-format-main">
        <p>Name</p>
        <p>Variant </p>
        <p> Base Price</p>
        <p> Price</p>
        <p>Quantity</p>
        <p>Total</p>
        <p>Remove</p>
      </div>
      <hr />

      {cart.length === 0 ? (
        <div className="flex justify-center items-center h-screen text-xl">
          No Cart Found
        </div>
      ) : (
        cart
          .filter((item) => item.status === "PENDING")
          .map((item) => (
            <div key={item.id}>
              <div className="cartitems-format cartitems-format-main">
                {/* <img src={e.image} alt="" className="carticon-product-icon" /> */}
                <p>{item.product.name}</p>
                <p>{item.variant.name}</p>
                <p>Rs {item.product.salePrice}</p>
                <p>Rs {item.variant.salePrice}</p>
                <button className="cartitems-quantity">{item.quantity}</button>
                <p>Rs {item.variant.salePrice * item.quantity}</p>
                <p>
                  <Image
                    className="cartitems-remove-icon"
                    src="/cart_cross_icon.png"
                    width={20}
                    height={20}
                    onClick={() => {
                      handleRemoveItem(item.id);
                    }}
                    alt=""
                  />
                </p>
              </div>
              <hr />
            </div>
          ))
      )}

      <div className="cartitems-down">
        <div className="cartitems-total">
          <h1>Cart Totals</h1>
          <div>
            <div className="cartitems-total-item">
              <p>SubTotal</p>
              <p>Rs {subTotal}</p>
            </div>
            <hr />
            <div className="cartitems-total-item">
              <p>Home Delivery</p>
              <p>Free</p>
            </div>
            <hr />
            <div className="cartitems-total-item">
              <h3>Total</h3>
              <h3>Rs {subTotal}</h3>
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
