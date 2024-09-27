-- DropForeignKey
ALTER TABLE "SalesInvoice" DROP CONSTRAINT "SalesInvoice_orderId_fkey";

-- AddForeignKey
ALTER TABLE "SalesInvoice" ADD CONSTRAINT "SalesInvoice_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;
