import React from 'react'
import CartItems from '../../../components/Cart/CartItems'
import { getCarts, getUserCarts, responseUserCart } from '@/server-actions/cart'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../api/auth/[...nextauth]/options'
import { log } from 'handlebars/runtime'
import { Response } from '@/types'
import { notFound } from 'next/navigation'

const page =  async () => {
  const session = await getServerSession(authOptions);
 
  const cartItemsDetails=  await getUserCarts(session?.user.id ?? null);
 
  if(!cartItemsDetails.success)
  {
    return notFound();
  }



  
  return (
    <div>
      <CartItems totaltax={cartItemsDetails.data?.totaltax ?? 0} subtotal={cartItemsDetails.data?.subtotal ?? 0} cart={cartItemsDetails.data?.cartItems} session={session ?? null} />
    </div>
  )
}

export default page
