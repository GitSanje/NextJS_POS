/*
  Warnings:

  - You are about to drop the column `taxId` on the `SalesInvoice` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "SalesInvoice" DROP CONSTRAINT "SalesInvoice_taxId_fkey";

-- AlterTable
ALTER TABLE "SalesInvoice" DROP COLUMN "taxId";

-- CreateTable
CREATE TABLE "_SalesInvoiceToTax" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_SalesInvoiceToTax_AB_unique" ON "_SalesInvoiceToTax"("A", "B");

-- CreateIndex
CREATE INDEX "_SalesInvoiceToTax_B_index" ON "_SalesInvoiceToTax"("B");

-- AddForeignKey
ALTER TABLE "_SalesInvoiceToTax" ADD CONSTRAINT "_SalesInvoiceToTax_A_fkey" FOREIGN KEY ("A") REFERENCES "SalesInvoice"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SalesInvoiceToTax" ADD CONSTRAINT "_SalesInvoiceToTax_B_fkey" FOREIGN KEY ("B") REFERENCES "Tax"("id") ON DELETE CASCADE ON UPDATE CASCADE;
