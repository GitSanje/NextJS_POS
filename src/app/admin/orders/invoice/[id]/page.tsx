import { Button } from '@/components/ui/button';
// import SalesInvoice from '@/src/components/Invoice/SaleInvoice'
import PageHeader from '@/src/components/PageHeader/PageHeader';
import { getAOrder } from '@/src/server-actions/order/order';

import React from 'react'

const page = async (
  props: {
      params: Promise<{
        id: string;
      }>;
    }
) => {
  const params = await props.params;
  const order = await getAOrder(params.id);
  return (
    <>
        
       <h2> Sale Invoice</h2>
        
        {/* <SalesInvoice order={order} /> */}
      
    </>
  )
}

export default page
