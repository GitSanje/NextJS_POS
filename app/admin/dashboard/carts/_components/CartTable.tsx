import React from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { MoreVertical } from "lucide-react";
import Link from "next/link";

import { DeleteDropdownItem } from "@/components/DropDown/Actions";
import { getallCartData,removeCart } from "@/server-actions/cart";
import StatusCell from "@/components/Orders/Status";

const CartTable = async () => {
  const carts = await getallCartData();
  console.log(carts, "carts");

  if (carts?.length === 0) return <p>No carts found</p>;
  return (
    <div className="container mx-auto mt-8 px-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Cart ID</TableHead>
            <TableHead>User</TableHead>
            <TableHead>Product</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Variants</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-0">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {carts?.map((cart) => (
            <TableRow key={cart.id}>
              <TableCell>{cart.id}</TableCell>
              <TableCell>{cart.user?.name || 'N/A'}</TableCell>
              <TableCell>{cart.product?.name || 'N/A'}</TableCell>
              <TableCell>{cart.quantity}</TableCell>
              <TableCell>
                {cart.variants && cart.variants.length > 0 
                  ? cart.variants.find(v => v.salePrice)?.salePrice 
                  : cart.product?.salePrice || 'N/A'}
              </TableCell>
              <TableCell>
                {cart.variants && cart.variants.length > 0 ? (
                  <ul className="list-disc list-inside">
                    {cart.variants.map((variant, index) => (
                      <li key={index}>
                        {variant.option?.value || 'Variant'} 
                        {variant.salePrice ? ` - $${variant.salePrice}` : ''}
                      </li>
                    ))}
                  </ul>
                ) : (
                  'No Variants'
                )}
              </TableCell>
              <TableCell>
              <StatusCell status={cart.status} isCartStatus={true} /> </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <MoreVertical />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem asChild>
                      <Link href={`/admin/carts/${cart.id}/edit`}>
                        Edit
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href={`/admin/carts/view/${cart.id}`}>
                        View
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />
                    
                    {/* <DeleteDropdownItem
                      id={cart.id} 
                      deleteFun={removeCart}
                    /> */}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default CartTable;