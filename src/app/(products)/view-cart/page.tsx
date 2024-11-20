import React from 'react'
import CartItems from '../../../components/Cart/CartItems'
import { getCarts, getUserCarts } from '@/src/server-actions/cart'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../api/auth/[...nextauth]/options'
import { log } from 'handlebars/runtime'


const page =  async () => {
  const session = await getServerSession(authOptions);
 
  const cartItemsDetails =  await getUserCarts(session?.user.id ?? null);

  const   { cartItems, subTotal,totaltax} = cartItemsDetails;
  
  return (
    <div>
      <CartItems totaltax={totaltax} subtotal={subTotal} cart={cartItems} session={session ?? null} />
    </div>
  )
}

export default page
