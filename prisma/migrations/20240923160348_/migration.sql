/*
  Warnings:

  - You are about to drop the column `variantOptionId` on the `Cart` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Cart" DROP CONSTRAINT "Cart_variantOptionId_fkey";

-- AlterTable
ALTER TABLE "Cart" DROP COLUMN "variantOptionId";

-- CreateTable
CREATE TABLE "_CartToProductVariant" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_CartToProductVariant_AB_unique" ON "_CartToProductVariant"("A", "B");

-- CreateIndex
CREATE INDEX "_CartToProductVariant_B_index" ON "_CartToProductVariant"("B");

-- AddForeignKey
ALTER TABLE "_CartToProductVariant" ADD CONSTRAINT "_CartToProductVariant_A_fkey" FOREIGN KEY ("A") REFERENCES "Cart"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CartToProductVariant" ADD CONSTRAINT "_CartToProductVariant_B_fkey" FOREIGN KEY ("B") REFERENCES "ProductVariant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
