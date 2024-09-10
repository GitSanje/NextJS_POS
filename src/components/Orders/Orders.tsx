"use client"

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { useOrderStore } from '../../hooks/useOrderStore';
import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Button from '../Button/Button';
import DeleteForm from './DeleteForm';

const Orders = () => {
    const { orders, counter, isLoading, getOrder } = useOrderStore();
    const { data: session } = useSession();
    const userId = session?.user?.id;

    useEffect(() => {
        if (userId) {
            getOrder(userId);
        }
    }, [userId]);

    if (isLoading) {
        return <div className="flex justify-center items-center h-screen text-xl">Loading...</div>;
    }

    return (
        <div className="container mx-auto mt-8 px-4">
            <h1 className="text-2xl font-bold mb-6">All Orders List</h1>
            {counter === 0 ? (
                <div className="bg-blue-100 text-blue-800 p-4 rounded-md shadow-md">
                    No orders found.
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 bg-white shadow-md rounded-md">
                        <thead className="bg-gray-100 text-gray-600">
                            <tr>
                                <th className="px-6 py-3 text-left text-sm font-medium">Order ID</th>
                                <th className="px-6 py-3 text-left text-sm font-medium">Order Date</th>
                                <th className="px-6 py-3 text-left text-sm font-medium">Delivery Date</th>
                                <th className="px-6 py-3 text-left text-sm font-medium">Quantity</th>
                                <th className="px-6 py-3 text-left text-sm font-medium">Address</th>
                                <th className="px-6 py-3 text-left text-sm font-medium">Status</th>
                                <th className="px-16 py-3 text-left text-sm font-medium">Items</th>
                                <th className="px-6 py-3 text-left text-sm font-medium">Delete</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {orders.map((order) => (
                                <tr key={order.id}>
                                    <td className="px-6 py-4 text-sm text-gray-900">{order.id}</td>
                                    <td className="px-6 py-4 text-sm text-gray-500">{new Date(order.orderDate).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 text-sm text-gray-500">{new Date(order.deliveryDate).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 text-sm text-gray-900">{order.quantity}</td>
                                    <td className="px-6 py-4 text-sm text-gray-900">{`${order.streetAddress}, ${order.city}, ${order.state}`}</td>
                                    <td className="px-6 py-4 text-sm text-gray-900">{order.status}</td>

                                    <td className="px-6 py-4 text-sm text-gray-900">
                                        <ul className="list-disc list-inside">
                                            {order.carts.map((cart, index) => (
                                                <li key={index}>
                                                    {cart.quantity} x {cart.product.name} {cart.variant ? `(${cart.variant.name})` : ''} - ${cart.product.salePrice} each
                                                </li>
                                            ))}
                                        </ul>
                                    </td>

                                    <td className="px-6 py-4 text-sm text-gray-900  ">
                                       <DeleteForm id={order.id} />
                                     
                                        </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
            <ToastContainer />
        </div>
    );
};

export default Orders;
