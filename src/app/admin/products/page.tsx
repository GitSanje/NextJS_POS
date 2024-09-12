import React from "react";
import { CheckCircle2 } from "lucide-react";

import { prisma } from "../../../vendor/prisma";
import { Button } from "@/components/ui/button";
import PageHeader from "../../../components/PageHeader/PageHeader";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu";
import Link from "next/link";
import ProductTable from "./_components/ProductTable";
import ProductForm from "@/src/components/form/ProductForm";
import ProductModel from "@/src/components/Model/ProductModel";

const page = () => {
  return (
    <>
      <div className="container mx-auto flex justify-between items-center gap-4">
        <PageHeader>All Products</PageHeader>


        <ProductModel/>
            
        
      </div>
      <ProductTable />
      
    </>
  );
};

export default page;
