import ViewOrder from "@/src/components/Orders/ViewOrder";

import { getAOrder } from "@/src/server-actions/order/order";

import React from "react";

const page = async (
  props: {
    params: Promise<{
      id: string;
    }>;
  }
) => {
  const params = await props.params;
  const order = await getAOrder(params.id);

  return <ViewOrder order={order} />;
};

export default page;
