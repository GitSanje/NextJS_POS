import React from "react";

import ViewOrder from "@/src/components/Orders/ViewOrder";
import { getUserOrder } from "@/src/server-actions/order/order";
import { getServerSession } from "next-auth";
import { authOptions } from "../../api/auth/[...nextauth]/options";
import { OrderType } from "@/src/types";

const page = async () => {
  const session = await getServerSession(authOptions);
  const orders: OrderType[] = await getUserOrder(session?.user.id);
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
            {orders?.map((order) => (
              <ViewOrder order={order} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default page;
