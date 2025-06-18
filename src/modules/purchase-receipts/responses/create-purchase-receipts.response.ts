export interface CreatePurchaseReceiptsResponse {
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
