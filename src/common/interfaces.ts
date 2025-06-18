import { Max, Min } from "encore.dev/validate";

export interface Meta {
    total: number;
    page: number;
    lastPage: number;
}

export class PaginationDto {
    public page: number = 1;
    public limit: number = 10;

    public key: string = '';
    public operator: string = '';
    public value: string = '';
}

export interface PaginationInterface {
    page: number & (Min<1>);
    limit: number & (Min<1> & Max<5000>);

    key?: string;
    operator?: string;
    value?: string;
}