/*
  Warnings:

  - You are about to drop the `_ProductSuppliers` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ProductVariant" DROP CONSTRAINT "ProductVariant_var_opt_fkey";

-- DropForeignKey
ALTER TABLE "_ProductSuppliers" DROP CONSTRAINT "_ProductSuppliers_A_fkey";

-- DropForeignKey
ALTER TABLE "_ProductSuppliers" DROP CONSTRAINT "_ProductSuppliers_B_fkey";

-- AlterTable
ALTER TABLE "ProductVariant" ALTER COLUMN "var_opt" DROP NOT NULL;

-- DropTable
DROP TABLE "_ProductSuppliers";

-- CreateTable
CREATE TABLE "_ProductToSupplier" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ProductToSupplier_AB_unique" ON "_ProductToSupplier"("A", "B");

-- CreateIndex
CREATE INDEX "_ProductToSupplier_B_index" ON "_ProductToSupplier"("B");

-- AddForeignKey
ALTER TABLE "ProductVariant" ADD CONSTRAINT "ProductVariant_var_opt_fkey" FOREIGN KEY ("var_opt") REFERENCES "VariantOption"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductToSupplier" ADD CONSTRAINT "_ProductToSupplier_A_fkey" FOREIGN KEY ("A") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductToSupplier" ADD CONSTRAINT "_ProductToSupplier_B_fkey" FOREIGN KEY ("B") REFERENCES "Supplier"("id") ON DELETE CASCADE ON UPDATE CASCADE;
