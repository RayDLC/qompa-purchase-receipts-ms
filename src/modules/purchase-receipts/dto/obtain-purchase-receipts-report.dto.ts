import { MaxLen } from "encore.dev/validate";

export interface ObtainPurchaseReceiptsReportDto {
    question: string & (MaxLen<1000>);
}