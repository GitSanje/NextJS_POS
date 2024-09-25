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
        <div className='max-w-4xl  mx-auto flex justify-between pt-5 '>
        <PageHeader> Sale Invoice</PageHeader>
        <Button
          type="button"
          className="inline-flex items-center justify-center px-4 py-3 text-xs font-bold text-gray-900 transition-all duration-200 bg-gray-100 border border-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 hover:bg-gray-200"
        >
          Download Invoice
        </Button>
        </div>
      
        
        <SalesInvoice order={order} />
      
    </>
  )
}

export default page
