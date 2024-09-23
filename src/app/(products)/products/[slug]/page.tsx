import { authOptions } from "@/src/app/api/auth/[...nextauth]/options";
import AddCart from "@/src/components/Cart/AddCart";
import CustomizeProducts from "@/src/components/Product/CustomizedProducts";
import ProductImages from "@/src/components/Product/ProductImages";
import { getallOptions, getallVarients, productgetById } from "@/src/lib/dal";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";
import React from "react";

const page = async ({
  params,
}: {
  params: {
    slug: string;
  };
}) => {
  const product = await productgetById(params.slug);
  const options = await getallOptions();
  const varients = await getallVarients();
  if (!product) {
    return notFound();
  }
  const product_varients = product.ProductVariant;
  const discount = product?.discount ? parseFloat(product.discount) : 0;
  const salePrice = product?.salePrice ? product.salePrice : 0;
  const discountPrice = salePrice - (discount / 100) * salePrice;

  console.log(product_varients);

  return (
    <>
      <div className="px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64 relative flex flex-col lg:flex-row gap-16">
        {/* IMG */}
        <div className="w-full lg:w-1/2 lg:sticky top-20 h-max">
          <ProductImages items={product.image} />
        </div>
        {/* TEXTS */}
        <div className="w-full lg:w-1/2 flex flex-col gap-6">
          <h1 className="text-4xl font-medium">{product.name}</h1>
          <p className="text-gray-500">{product.description}</p>
          <div className="h-[2px] bg-gray-100" />
          {!discount && product.salePrice ? (
            <h2 className="font-medium text-2xl">${product.salePrice}</h2>
          ) : (
            <div className="flex items-center gap-4">
              <h3 className="text-xl text-gray-500 line-through">
                ${product.salePrice}
              </h3>
              <h2 className="font-medium text-2xl">${discountPrice}</h2>
            </div>
          )}

          <div className="h-[2px] bg-gray-100" />

     
           {varients && varients.length> 0? (
          <CustomizeProducts
            productId={product.id}
            variants={varients}
            productOptions={product_varients}
          />
        ) : (
            "")}

          <AddCart
            productId={product.id}
            stockNumber={product.quantityInStock}

            // variantId={null}
          />
         
          {/* <Add
        //     productId={product._id!}
        //     variantId="00000000-0000-0000-0000-000000000000"
        //     stockNumber={product.stock?.quantity || 0}
        //   /> */}
        </div>
      </div>
    </>
  );
};

export default page;
