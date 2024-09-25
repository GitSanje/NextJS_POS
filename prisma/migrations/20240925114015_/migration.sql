/*
  Warnings:

  - A unique constraint covering the columns `[InvoiceId]` on the table `SalesInvoice` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `InvoiceId` to the `SalesInvoice` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "SalesInvoice" ADD COLUMN     "InvoiceId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "SalesInvoice_InvoiceId_key" ON "SalesInvoice"("InvoiceId");
