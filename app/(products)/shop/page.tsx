
import { Metadata } from "next";
import { category, productType } from "@/types/productType";
import { getProducts } from "@/server-actions/product/product";
import { getCategories } from "@/server-actions/cagtegory/category";
import ShopSection from "@/components/Product/ShopSection";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Shop",
};

export default  async function Shop() {

  const products: productType[] | null = await getProducts()
  const categories: category = await getCategories(false)
  if(!products)
  {
    return notFound();
  }


  let categoriesObj = ['All'];
  Object.entries(categories).forEach((obj) => {
    if (!categoriesObj.includes(obj[1].categoryName)) {
      categoriesObj.push(obj[1].categoryName);
    }
  });
  



  return (
    <div className="pt-20">
      <ShopSection products= {products} categories= {categoriesObj} />;
    </div>
  );
}
