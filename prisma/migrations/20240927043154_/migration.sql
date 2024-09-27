-- DropForeignKey
ALTER TABLE "Cart" DROP CONSTRAINT "Cart_orderId_fkey";

-- AddForeignKey
ALTER TABLE "Cart" ADD CONSTRAINT "Cart_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;
