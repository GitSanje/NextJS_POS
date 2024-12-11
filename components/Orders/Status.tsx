import React from 'react';
import { OrderStatus, CartStatus } from '@prisma/client';

// Define colors for each status
const orderStatusColors: Record<OrderStatus, string> = {
  [OrderStatus.PENDING]: 'bg-yellow-500 text-white',
  [OrderStatus.SHIPPED]: 'bg-blue-500 text-white',
  [OrderStatus.DELIVERED]: 'bg-green-500 text-white',
  [OrderStatus.CANCELLED]: 'bg-red-500 text-white',
};

const cartStatusColors: Record<CartStatus, string> = {
  [CartStatus.PENDING]: 'bg-yellow-500 text-white',
  [CartStatus.CHECKOUT]: 'bg-green-500 text-white',

};

type Status = OrderStatus | CartStatus; 

interface StatusCellProps {
  status: Status;
  isCartStatus?: boolean; 
}

const StatusCell: React.FC<StatusCellProps> = ({ status, isCartStatus = false }) => {
  const statusColors = isCartStatus 
  ? cartStatusColors as Record<Status, string>
  : orderStatusColors as Record<Status, string>;

  return (
    <td className="px-4 py-2">
      <span className={`px-2 py-1 rounded-full ${statusColors[status as Status ] }`}>
        {status}
      </span>
    </td>
  );
};

export default StatusCell;
