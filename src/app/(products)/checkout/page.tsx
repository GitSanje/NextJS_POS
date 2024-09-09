import React from 'react'
import CheckoutForm from '../../../components/Checkout/Checkout'
import { useSession } from 'next-auth/react'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../api/auth/[...nextauth]/options'

const page:React.FC = async () => {

  const session = await getServerSession(authOptions)
  return (
    <div>
        <CheckoutForm  session= {session}/>
        
      
    </div>
  )
}

export default page
