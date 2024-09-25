-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "taxId" TEXT;

-- AlterTable
ALTER TABLE "SalesInvoice" ADD COLUMN     "taxId" TEXT,
ALTER COLUMN "invoiceDate" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "totalAmount" DROP NOT NULL;

-- CreateTable
CREATE TABLE "Tax" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "rate" DOUBLE PRECISION NOT NULL,
    "description" TEXT,

    CONSTRAINT "Tax_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_taxId_fkey" FOREIGN KEY ("taxId") REFERENCES "Tax"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SalesInvoice" ADD CONSTRAINT "SalesInvoice_taxId_fkey" FOREIGN KEY ("taxId") REFERENCES "Tax"("id") ON DELETE SET NULL ON UPDATE CASCADE;
