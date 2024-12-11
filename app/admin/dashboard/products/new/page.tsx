import { authOptions } from '@/app/api/auth/[...nextauth]/options'
import ProductForm from '@/components/form/ProductForm'
import PageHeader from '@/components/PageHeader/PageHeader'
import { getCategories } from '@/server-actions/cagtegory/category'
import { getSuppliers } from '@/server-actions/supplier/supplier'
import { getTaxes } from '@/server-actions/tax'
import { categoryType, SelectType, taxType } from '@/types'

import { getServerSession } from "next-auth/next"


import React from 'react'


const page = async () => {

  const session = await getServerSession(authOptions)
  const userId = session?.user.id;
  const categoriesData = (await getCategories(true)) ?? [];
  const suppliersData = (await getSuppliers(true)) ?? [];
  const taxs:  SelectType[] =  (await getTaxes(true)) ?? [];

  const seenLabels = new Set();
  
  const categoriesDatafinal = categoriesData.filter((cat) =>  {
    if (seenLabels.has(cat.label)) {
      return false; 
    }
    seenLabels.add(cat.label); 
    return true; 
  }
    
  )

  
  return (
    <div className="py-5">
    <div className="flex justify-center">
    <PageHeader> Add a Product </PageHeader>
    </div>
 
  <ProductForm userId={userId} suppliers={suppliersData} categories={categoriesDatafinal} taxs={taxs}/>
</div>
  )
}

export default page
