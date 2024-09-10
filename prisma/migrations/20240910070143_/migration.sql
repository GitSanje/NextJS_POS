/*
  Warnings:

  - You are about to drop the `_OrderVariants` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_ProductOrders` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_OrderVariants" DROP CONSTRAINT "_OrderVariants_A_fkey";

-- DropForeignKey
ALTER TABLE "_OrderVariants" DROP CONSTRAINT "_OrderVariants_B_fkey";

-- DropForeignKey
ALTER TABLE "_ProductOrders" DROP CONSTRAINT "_ProductOrders_A_fkey";

-- DropForeignKey
ALTER TABLE "_ProductOrders" DROP CONSTRAINT "_ProductOrders_B_fkey";

-- DropTable
DROP TABLE "_OrderVariants";

-- DropTable
DROP TABLE "_ProductOrders";
