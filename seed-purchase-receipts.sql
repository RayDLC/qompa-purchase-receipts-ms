-- Insertar datos de ejemplo
INSERT INTO "public"."PurchaseReceipt" (
  "company_id", "supplier_ruc", "invoice_number", "amount", "igv", "total",
  "issue_date", "document_type", "status", "createdAt", "updatedAt"
) VALUES
('123', '20337564373', 'F001-00069608', 10.00, 1.80, 11.80, '2025-11-10 23:00:00', 'Factura', 'PENDING', NOW(), NOW()),
('123', '20337564373', 'B001-00069608', 1990.00, 358.20, 2348.20, '2025-11-10 23:00:00', 'Boleta', 'PENDING', NOW(), NOW()),
('123', '20337564373', 'F001-00069608', 1990.00, 358.20, 2348.20, '2025-11-10 23:00:00', 'Factura', 'VALIDATED', NOW(), NOW()),
('321', '20337564373', 'B001-00069608', 3000.00, 540.00, 3540.00, '2025-11-10 23:00:00', 'Boleta', 'PENDING', NOW(), NOW());