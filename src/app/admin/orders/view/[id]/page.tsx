import ViewOrder from "@/src/components/Orders/ViewOrder";

import { getAOrder } from "@/src/server-actions/order/order";

import React from "react";

const page = async ({
  params,
}: {
  params: {
    id: string;
  };
}) => {
  const order = await getAOrder(params.id);

  return <ViewOrder order={order} />;
};

export default page;
