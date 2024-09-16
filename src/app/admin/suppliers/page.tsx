
import { getSuppliers } from '@/src/server-actions/supplier/supplier'
import React from 'react'

const page = async() => {
    const suppliers = await getSuppliers()
    console.log(suppliers);
    
  return (
    <div>

      
    </div>
  )
}

export default page
