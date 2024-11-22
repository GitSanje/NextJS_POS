
// import SalesInvoice from "@/src/components/Invoice/SaleInvoice";
import {  getInvoice } from "@/server-actions/order/order";

type tParams = Promise<{ id: string }>;


const page = async (props: { params: tParams }) => {
  const params = await props.params;
  const id =( await params).id;
  // const Invoicedata  = await getInvoice(id);

  // if (!Invoicedata) {
  //   // Handle the case where the invoice is not found
  //   console.error("Invoice not found");
  //   return;
  // }

  // // Use invoice safely here

  // console.log('====================================');
  // console.log(Invoicedata,'invoiceData');
  // console.log('====================================');
  return (
    <>
    <h2> Sale Invoice</h2>
      {/* <SalesInvoice invoiceProp={Invoicedata} hidden={false} /> */}
    </>
  );
};

export default page;
