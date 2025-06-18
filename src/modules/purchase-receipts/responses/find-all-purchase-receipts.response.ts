import { Meta } from "../../../common";

export interface FindAllPurchaseReceiptsResponse {
    data: Data[];
    meta: Meta;
}

interface Data {
    amount:         number;
    company_id:     string;
    createdAt:      Date;
    document_type:  string;
    id:             string;
    igv:            number;
    invoice_number: string;
    issue_date:     Date;
    status:         string;
    supplier_ruc:   string;
    total:          number;
    updatedAt:      Date;
}