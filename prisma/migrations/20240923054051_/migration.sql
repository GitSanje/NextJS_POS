/*
  Warnings:

  - You are about to drop the column `variantId` on the `Cart` table. All the data in the column will be lost.
  - The `status` column on the `Inventory` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `paymentMethodId` on the `Order` table. All the data in the column will be lost.
  - The `status` column on the `Product` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `costPrice` on the `Variant` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Variant` table. All the data in the column will be lost.
  - You are about to drop the column `priceDifference` on the `Variant` table. All the data in the column will be lost.
  - You are about to drop the column `productId` on the `Variant` table. All the data in the column will be lost.
  - You are about to drop the column `salePrice` on the `Variant` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Variant` table. All the data in the column will be lost.
  - The `status` column on the `Variant` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `PaymentMethod` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Cart" DROP CONSTRAINT "Cart_variantId_fkey";

-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_paymentMethodId_fkey";

-- DropForeignKey
ALTER TABLE "Variant" DROP CONSTRAINT "Variant_productId_fkey";

-- AlterTable
ALTER TABLE "Cart" DROP COLUMN "variantId",
ADD COLUMN     "variantOptionId" TEXT;

-- AlterTable
ALTER TABLE "Inventory" ALTER COLUMN "restockDate" DROP NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "paymentMethodId";

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "isFeatured" BOOLEAN DEFAULT false,
ADD COLUMN     "slug" TEXT,
DROP COLUMN "status",
ADD COLUMN     "status" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "Supplier" ADD COLUMN     "address" TEXT;

-- AlterTable
ALTER TABLE "Variant" DROP COLUMN "costPrice",
DROP COLUMN "createdAt",
DROP COLUMN "priceDifference",
DROP COLUMN "productId",
DROP COLUMN "salePrice",
DROP COLUMN "updatedAt",
DROP COLUMN "status",
ADD COLUMN     "status" BOOLEAN NOT NULL DEFAULT true;

-- DropTable
DROP TABLE "PaymentMethod";

-- DropEnum
DROP TYPE "ProductStatus";

-- CreateTable
CREATE TABLE "ProductVariant" (
    "id" TEXT NOT NULL,
    "var_id" TEXT NOT NULL,
    "var_opt" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "var_img" TEXT,
    "salePrice" DOUBLE PRECISION NOT NULL,
    "stock" INTEGER,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "priceDifference" DOUBLE PRECISION,
    "costPrice" DOUBLE PRECISION,
    "discount" TEXT,

    CONSTRAINT "ProductVariant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VariantOption" (
    "id" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "var_id" TEXT NOT NULL,
    "variantName" TEXT,

    CONSTRAINT "VariantOption_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PaymentType" (
    "id" TEXT NOT NULL,
    "paymentType" TEXT NOT NULL,

    CONSTRAINT "PaymentType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserPaymentMethod" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "typeId" TEXT NOT NULL,
    "provider" TEXT,
    "account_number" TEXT,
    "expiry_date" TIMESTAMP(3),
    "is_default" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "UserPaymentMethod_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Cart" ADD CONSTRAINT "Cart_variantOptionId_fkey" FOREIGN KEY ("variantOptionId") REFERENCES "ProductVariant"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductVariant" ADD CONSTRAINT "ProductVariant_var_id_fkey" FOREIGN KEY ("var_id") REFERENCES "Variant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductVariant" ADD CONSTRAINT "ProductVariant_var_opt_fkey" FOREIGN KEY ("var_opt") REFERENCES "VariantOption"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductVariant" ADD CONSTRAINT "ProductVariant_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VariantOption" ADD CONSTRAINT "VariantOption_var_id_fkey" FOREIGN KEY ("var_id") REFERENCES "Variant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserPaymentMethod" ADD CONSTRAINT "UserPaymentMethod_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserPaymentMethod" ADD CONSTRAINT "UserPaymentMethod_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "PaymentType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
