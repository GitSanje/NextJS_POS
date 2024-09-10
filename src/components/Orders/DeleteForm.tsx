
import React from 'react'
import { deleteOrder } from '../../server-actions/order/order'
import Button from '../Button/Button'

interface Props{
    id: string 
}
const DeleteForm: React.FC<Props>= (props) => {
    const { id} = props

  return (
    <>
    <form className=''
    action={deleteOrder}>
        <input type='hidden' name='id' value={id}/>
        <Button className='px-4'>
            Delete
        </Button>
         
    </form>
      
    </>
  )
}

export default DeleteForm
