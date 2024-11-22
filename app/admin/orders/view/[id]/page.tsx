import ViewOrder from "@/components/Orders/ViewOrder";

import { getAOrder } from "@/server-actions/order/order";
import { OrderType } from "@/types";

import React from "react";

const page = async (
  props: {
    params: Promise<{
      id: string;
    }>;
  }
) => {
  const params = await props.params;
  const order: OrderType = await getAOrder(params.id);

  return <ViewOrder order={order} />;
};

export default page;
