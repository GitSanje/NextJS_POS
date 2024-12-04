

import SalesInvoice from "@/components/Invoice/SaleInvoice";

import {  getInvoice } from "@/server-actions/order/order";
import { InvoiceDataType } from "@/types";

type tParams = Promise<{ id: string }>;


const page = async (props: { params: tParams }) => {
  const params = await props.params;
  const id =( await params).id;
   const Invoicedata:InvoiceDataType | null  = await getInvoice(id);
  
  if (!Invoicedata) {
    // Handle the case where the invoice is not found
    console.error("Invoice not found");
    return;
  }

  // // Use invoice safely here

  // console.log('====================================');
  // console.log(Invoicedata,'invoiceData');
  // console.log('====================================');
  return (
    <>

      <SalesInvoice invoice={Invoicedata} hidden={false} />
    </>
  );
};

export default page;
