import ProductList from "@/components/Product/ProductList";
import { ProductCardSkeleton } from "@/components/Product/ProductSkeleton";
import { getProducts } from "@/services/product";
import React, { Suspense } from "react";

const page = async () => {
  return (
    <div>
      <Suspense
        fallback={
          <>
            <div className="container mx-auto mt-12 flex gap-x-8 gap-y-16 justify-between flex-wrap">
              <ProductCardSkeleton />
            </div>
          </>
        }
      >
        <ProductSuspense />
      </Suspense>
    </div>
  );
};

export default page;

async function ProductSuspense() {
  const product = await getProducts();

  return <ProductList products={product} />;
}
