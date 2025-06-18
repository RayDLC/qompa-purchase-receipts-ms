-- CreateEnum
CREATE TYPE "PurchaseReceiptStatus" AS ENUM ('PENDING', 'VALIDATED', 'REJECTED', 'OBSERVED');

-- CreateTable
CREATE TABLE "PurchaseReceipt" (
    "id" TEXT NOT NULL,
    "company_id" TEXT NOT NULL,
    "supplier_ruc" TEXT NOT NULL,
    "invoice_number" TEXT NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "igv" DECIMAL(10,2) NOT NULL,
    "total" DECIMAL(10,2) NOT NULL,
    "issue_date" TIMESTAMP(3) NOT NULL,
    "document_type" TEXT NOT NULL,
    "status" "PurchaseReceiptStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PurchaseReceipt_pkey" PRIMARY KEY ("id")
);
