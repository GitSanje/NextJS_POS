/*
  Warnings:

  - You are about to drop the column `delivaryDate` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `streetaddress` on the `Order` table. All the data in the column will be lost.
  - Added the required column `streetAddress` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "CartStatus" AS ENUM ('PENDING', 'CHECKOUT');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('PENDING', 'SHIPPED', 'DELIVERED', 'CANCELLED');

-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_productId_fkey";

-- AlterTable
ALTER TABLE "Cart" ADD COLUMN     "status" "CartStatus" NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "delivaryDate",
DROP COLUMN "streetaddress",
ADD COLUMN     "deliveryDate" TIMESTAMP(3),
ADD COLUMN     "status" "OrderStatus" NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "streetAddress" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "_ProductOrders" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ProductOrders_AB_unique" ON "_ProductOrders"("A", "B");

-- CreateIndex
CREATE INDEX "_ProductOrders_B_index" ON "_ProductOrders"("B");

-- AddForeignKey
ALTER TABLE "_ProductOrders" ADD CONSTRAINT "_ProductOrders_A_fkey" FOREIGN KEY ("A") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductOrders" ADD CONSTRAINT "_ProductOrders_B_fkey" FOREIGN KEY ("B") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
