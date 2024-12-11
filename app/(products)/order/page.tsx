import React from "react";

import ViewOrder from "@/components/Orders/ViewOrder";
import { getUserOrder } from "@/server-actions/order/order";
import { getServerSession } from "next-auth";
import { authOptions } from "../../api/auth/[...nextauth]/options";
import { OrderType, OrderWithCartsType } from "@/types";
import { NoOrders } from "@/components/Orders/NoOrders";

const page = async () => {
  const session = await getServerSession(authOptions);
  const orders: OrderWithCartsType[] | null = await getUserOrder(
    session?.user.id
  );
  if (!orders) {
    return null;
  }
  console.log(orders);

  return (
    <>
      <div className="py-12 bg-white sm:py-16 lg:py-20">
        <div className="px-4 m-auto sm:px-6 lg:px-8 max-w-7xl">
          <div className="max-w-6xl mx-auto">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                Order Details
              </h1>
              <p className="mt-2 text-sm font-normal text-gray-600">
                Check the status of recent and old orders & discover more
                products
              </p>
            </div>
            {orders.length > 0 ? (
              orders?.map((order, index) => (
                <ViewOrder order={order} key={index} />
              ))
            ) : (
              <NoOrders Title={"No orders placed"} dis={"You haven&apos;t placed any orders yet. Start shopping to see your orders here!"} />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default page;
