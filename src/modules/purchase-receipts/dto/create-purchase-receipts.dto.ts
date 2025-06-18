import { Min, MinLen } from "encore.dev/validate";

export interface CreatePurchaseReceiptsDto {
  company_id: string & (MinLen<1>);
  supplier_ruc: string & (MinLen<8>);
  invoice_number: string & (MinLen<1>);
  amount: number & (Min<0>);
  issue_date: Date;
  document_type: string & (MinLen<1>);
}