import React from 'react'
import { useFormStatus } from 'react-dom'
import Button from '../Button/Button'

const CheckoutButton: React.FC= () => {
    const { pending } = useFormStatus()
  return (
    <>
    <Button
    aria-disabled={pending}
    type='submit'
    className="w-full bg-indigo-500 text-white py-2 rounded-lg ">
       {pending ? 'Submitting...' : 'Checkout'}
    </Button>
      
    </>
  )
}

export default CheckoutButton
