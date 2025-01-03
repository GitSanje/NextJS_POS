import {
  deleteSupplier,
  getSuppliers,
} from "@/server-actions/supplier/supplier";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";
import {
  DeleteDropdownItem,
  DropDownTable,
  EditDropdownItem,
} from "@/components/DropDown/Actions";
import { supplierType, SelectType } from "@/types";
import { notFound } from "next/navigation";

const SupplierTable = async () => {
  const suppliers: supplierType | null = await getSuppliers(false);

  if(!suppliers){
    return notFound();
  }

  if (suppliers?.length === 0) return <p>No Suppliers found</p>;
  return (
    <div className="w-full">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Supplier Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Total products</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
        {suppliers.map((supplier) => {
            // Narrow the type at runtime
            if ("supplierName" in supplier) {
              return (
                <TableRow key={supplier.id}>
                  <TableCell>{supplier.supplierName}</TableCell>
                  <TableCell>{supplier.email}</TableCell>
                  <TableCell>{supplier.phone}</TableCell>
                  <TableCell>{supplier._count?.products}</TableCell>
                  <TableCell>
                    <DropDownTable supplier={supplier} />
                  </TableCell>
                </TableRow>
              );
            }
            return null;

          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default SupplierTable;
