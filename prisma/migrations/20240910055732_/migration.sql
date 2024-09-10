/*
  Warnings:

  - You are about to drop the column `variantId` on the `Order` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_variantId_fkey";

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "variantId";

-- CreateTable
CREATE TABLE "_OrderVariants" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_OrderVariants_AB_unique" ON "_OrderVariants"("A", "B");

-- CreateIndex
CREATE INDEX "_OrderVariants_B_index" ON "_OrderVariants"("B");

-- AddForeignKey
ALTER TABLE "_OrderVariants" ADD CONSTRAINT "_OrderVariants_A_fkey" FOREIGN KEY ("A") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_OrderVariants" ADD CONSTRAINT "_OrderVariants_B_fkey" FOREIGN KEY ("B") REFERENCES "Variant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
