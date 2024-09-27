
import SalesInvoice from "@/src/components/Invoice/SaleInvoice";
import {  getInvoice } from "@/src/server-actions/order/order";
import { InvoiceType } from "@/src/types";

import React from "react";

const page = async ({
  params,
}: {
  params: {
    id: string;
  };
}) => {
  const Invoicedata: InvoiceType  = await getInvoice(params.id);
  

  return (
    <>
      <SalesInvoice invoice={Invoicedata} hidden={false} />
    </>
  );
};

export default page;
