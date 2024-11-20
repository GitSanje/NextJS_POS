import { authOptions } from '@/src/app/api/auth/[...nextauth]/options'
import ProductForm from '@/src/components/form/ProductForm'
import PageHeader from '@/src/components/PageHeader/PageHeader'
import { getCategories } from '@/src/server-actions/cagtegory/category'
import { getSuppliers } from '@/src/server-actions/supplier/supplier'
import { getTaxes } from '@/src/server-actions/tax'
import { SelectType } from '@/src/types/orderType'
import { getServerSession } from "next-auth/next"


import React from 'react'


const page = async () => {

  const session = await getServerSession(authOptions)
  const userId = session?.user.id;
  const categoriesData = (await getCategories(true)) ?? [];
  const suppliersData = (await getSuppliers(true)) ?? [];
  const taxs = (await getTaxes(true)) ?? [];


  return (
    <div className="py-5">
    <div className="flex justify-center">
    <PageHeader> Add a Product </PageHeader>
    </div>
 
  <ProductForm userId={userId} suppliers={suppliersData} categories={categoriesData} taxs={taxs}/>
</div>
  )
}

export default page
