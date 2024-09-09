/*
  Warnings:

  - You are about to drop the column `delivaaryDate` on the `Order` table. All the data in the column will be lost.
  - Added the required column `city` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `state` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `streetaddress` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Made the column `orderDate` on table `Order` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Order" DROP COLUMN "delivaaryDate",
ADD COLUMN     "city" TEXT NOT NULL,
ADD COLUMN     "delivaryDate" TIMESTAMP(3),
ADD COLUMN     "state" TEXT NOT NULL,
ADD COLUMN     "streetaddress" TEXT NOT NULL,
ALTER COLUMN "orderDate" SET NOT NULL,
ALTER COLUMN "orderDate" SET DEFAULT CURRENT_TIMESTAMP;
