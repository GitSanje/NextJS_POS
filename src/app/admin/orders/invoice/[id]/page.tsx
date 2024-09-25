import { Button } from '@/components/ui/button';
import SalesInvoice from '@/src/components/Invoice/SaleInvoice'
import PageHeader from '@/src/components/PageHeader/PageHeader';
import { getAOrder } from '@/src/server-actions/order/order';

import React from 'react'

const page = async({
    params,
  }: {
    params: {
      id: string;
    };
  }) => {
    const order = await getAOrder(params.id);
  return (
    <>
        
      
        
        <SalesInvoice order={order} />
      
    </>
  )
}

export default page
