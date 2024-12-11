import React from "react";
import CartItems from "../../../components/Cart/CartItems";
import {
  getCarts,
  getUserCarts,
  responseUserCart,
} from "@/server-actions/cart";
import { getServerSession } from "next-auth";
import { authOptions } from "../../api/auth/[...nextauth]/options";
import { log } from "handlebars/runtime";
import { Response } from "@/types";
import { notFound } from "next/navigation";
import { NoOrders } from "@/components/Orders/NoOrders";

const page = async () => {
  const session = await getServerSession(authOptions);

  const cartItemsDetails = await getUserCarts(session?.user.id ?? null);

  // if (!cartItemsDetails.success) {
  //   return notFound();
  // }

  return (
    <div>

{cartItemsDetails.data?.cartItems.length! > 0 ?
      <CartItems
        totaltax={cartItemsDetails.data?.totaltax ?? 0}
        subtotal={cartItemsDetails.data?.subtotal ?? 0}
        cart={cartItemsDetails.data?.cartItems}
        session={session ?? null}
      />
      :
      <div className="flex item-center justify-center">
<NoOrders Title={"No carts placed"} dis={"You haven&apos;t placed any carts yet. Start shopping to see your orders here!"} icon="cart" />

      </div>
      
}

    </div>
  );
};

export default page;
