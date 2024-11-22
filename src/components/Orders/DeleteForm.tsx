"use client"
import React from 'react'
import { deleteOrder } from '../../server-actions/order/order'
import Button from '../Button/Button'

interface Props {
    id: string
    onDelete?: (id: string) => void
}

const DeleteForm: React.FC<Props> = ({ id, onDelete }) => {
    const handleSubmit = async (formData: FormData) => {
        try {
            // Get the id from the hidden input
            const orderId = formData.get('id') as string
            await deleteOrder(orderId)
            // Call the onDelete callback if provided
            onDelete?.(orderId)
        } catch (error) {
            console.error('Failed to delete order:', error)
        }
    }

    return (
        <form action={handleSubmit} className=''>
            <input type='hidden' name='id' value={id} />
            <Button type="submit" className='px-4'>
                Delete
            </Button>
        </form>
    )
}

export default DeleteForm