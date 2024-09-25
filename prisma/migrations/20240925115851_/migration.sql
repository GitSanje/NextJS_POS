/*
  Warnings:

  - A unique constraint covering the columns `[orderId]` on the table `SalesInvoice` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "SalesInvoice_orderId_key" ON "SalesInvoice"("orderId");
