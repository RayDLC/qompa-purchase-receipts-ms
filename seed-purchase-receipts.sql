DROP TABLE IF EXISTS "public"."PurchaseReceipt";
-- This script only contains the table creation statements and does not fully represent the table in the database. Do not use it as a backup.

DROP TYPE IF EXISTS "public"."PurchaseReceiptStatus";
CREATE TYPE "public"."PurchaseReceiptStatus" AS ENUM ('PENDING', 'VALIDATED', 'REJECTED', 'OBSERVED');

-- Table Definition
CREATE TABLE "public"."PurchaseReceipt" (
    "id" text NOT NULL,
    "company_id" text NOT NULL,
    "supplier_ruc" text NOT NULL,
    "invoice_number" text NOT NULL,
    "amount" numeric(10,2) NOT NULL,
    "igv" numeric(10,2) NOT NULL,
    "total" numeric(10,2) NOT NULL,
    "issue_date" timestamp(3) NOT NULL,
    "document_type" text NOT NULL,
    "status" "public"."PurchaseReceiptStatus" NOT NULL DEFAULT 'PENDING'::"PurchaseReceiptStatus",
    "createdAt" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" timestamp(3) NOT NULL,
    PRIMARY KEY ("id")
);

-- Insertar datos de ejemplo
INSERT INTO "public"."PurchaseReceipt" (
  "company_id", "supplier_ruc", "invoice_number", "amount", "igv", "total",
  "issue_date", "document_type", "status", "createdAt", "updatedAt"
) VALUES
('123', '20337564373', 'F001-00069608', 10.00, 1.80, 11.80, '2025-11-10 23:00:00', 'Factura', 'PENDING', NOW(), NOW()),
('123', '20337564373', 'B001-00069608', 1990.00, 358.20, 2348.20, '2025-11-10 23:00:00', 'Boleta', 'PENDING', NOW(), NOW()),
('123', '20337564373', 'F001-00069608', 1990.00, 358.20, 2348.20, '2025-11-10 23:00:00', 'Factura', 'VALIDATED', NOW(), NOW()),
('321', '20337564373', 'B001-00069608', 3000.00, 540.00, 3540.00, '2025-11-10 23:00:00', 'Boleta', 'PENDING', NOW(), NOW());