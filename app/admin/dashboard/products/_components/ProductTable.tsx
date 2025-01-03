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

import { getProducts } from "@/services/product";

import { CheckCircle2, MoreVertical, XCircle } from "lucide-react";
import Link from "next/link";

const ProductTable = async () => {
  const products = await getProducts();


  if (products?.length === 0) return <p>No products found</p>;
  return (
    <div className='className="container mx-auto mt-8 px-4"'>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Product Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Cost Price</TableHead>
            <TableHead>Sale Price</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Category</TableHead>
            <TableHead className="w-0">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {products?.map((product) => (
            <TableRow key={product.id}>
              <TableCell>{product.name}</TableCell>
              <TableCell>{product.description}</TableCell>
              <TableCell>${product.costPrice.toFixed(2)}</TableCell>
              <TableCell>${product.salePrice?.toFixed(2)}</TableCell>
              <TableCell>{product.quantityInStock}</TableCell>

              <TableCell>
                {product?.status ? (
                  <>
                    <span className="sr-only">Available</span>
                    <CheckCircle2 className="text-green-500"/>
                  </>
                ) : (
                  <>
                    <span className="sr-only">Unavailable</span>
                    <XCircle className="text-red-500" />
                  </>
                )}
              </TableCell>
              <TableCell>{product?.category.categoryName}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <MoreVertical />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem asChild>
                      <a
                        download
                        href={`/admin/products/${product.id}/download`}
                      >
                        Download
                      </a>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href={`/admin/products/${product.id}/edit`}>
                        Edit
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />
                    {/* <ActiveToggleDropdownItem
                    id={product.id}
                    isAvailableForPurchase={product.isAvailableForPurchase}
                  /> */}
                    {/* <DeleteDropdownItem
                    id={product.id}
                    disabled={product._count.orders > 0}
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

export default ProductTable;
