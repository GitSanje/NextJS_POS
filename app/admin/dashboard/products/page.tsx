import React from "react";



import { Button } from "@/components/ui/button";

import Link from "next/link";
import ProductTable from "./_components/ProductTable";
import PageHeader from "@/components/PageHeader/PageHeader";

const page = () => {
  return (
    <>
      <div className="container mx-auto flex justify-between items-center gap-4">
        <PageHeader>All Products</PageHeader>
        <Button asChild>
          <Link href="/admin/dashboard/products/new">Add Product</Link></Button>


        {/* <ProductModel/> */}
            
        
      </div>
      <ProductTable />
      
    </>
  );
};

export default page;
