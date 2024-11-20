
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
  const Invoicedata  = await getInvoice(params.id);
  
if (!Invoicedata) {
  // Handle the case where the invoice is not found
  console.error("Invoice not found");
  return;
}

// Use invoice safely here

  console.log('====================================');
  console.log(Invoicedata,'invoiceData');
  console.log('====================================');
  return (
    <>
      <SalesInvoice invoiceProp={Invoicedata} hidden={false} />
    </>
  );
};

export default page;
