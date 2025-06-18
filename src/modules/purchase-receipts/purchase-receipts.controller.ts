import { api } from "encore.dev/api";
import applicationContext from "../../applicationContext";
import { CreatePurchaseReceiptsDto, ObtainPurchaseReceiptsReportDto } from "./dto";
import { CreatePurchaseReceiptsResponse, FindAllPurchaseReceiptsResponse } from "./responses";
import { PaginationDto, PaginationInterface } from "../../common";
import { isValidPaginationDto } from "../../common/functions";
import { Readable } from "stream";

export const create = api(
    { expose: true, method: 'POST', path: '/purchase-receipts' },
    async (dto: CreatePurchaseReceiptsDto): Promise<CreatePurchaseReceiptsResponse> => {
        const { purchaseReceiptsService } = await applicationContext;
        return await purchaseReceiptsService.create(dto);
    }
)

export const updateStatus = api(
    { expose: true, method: 'PATCH', path: '/purchase-receipts/:id/status/:status' },
    async (params: { id: string, status: string }): Promise<CreatePurchaseReceiptsResponse> => {
        const { purchaseReceiptsService } = await applicationContext;
        return await purchaseReceiptsService.updateStatus(params.id, params.status);
    }
)

export const findAll = api(
    { expose: true, method: 'GET', path: '/purchase-receipts' },
    async (query: PaginationInterface): Promise<FindAllPurchaseReceiptsResponse> => {
        isValidPaginationDto(query);
        const { purchaseReceiptsService } = await applicationContext;
        return await purchaseReceiptsService.findAll(query as PaginationDto);
    }
)

export const exportToCsv = api(
    { expose: true, method: 'GET', path: '/purchase-receipts/export/csv' },
    async (query: { key: string, operator: string, value: string }): Promise<{ csvString: string }> => {
        const { purchaseReceiptsService } = await applicationContext;
        return await purchaseReceiptsService.exportToCsv(query as PaginationDto);
    }
)

export const obtainPurchaseReceiptsReport = api(
    { expose: true, method: 'POST', path: '/purchase-receipts/report/chat' },
    async (dto: ObtainPurchaseReceiptsReportDto): Promise<{ answer: string }> => {
        const { purchaseReceiptsService } = await applicationContext;
        return await purchaseReceiptsService.obtainPurchaseReceiptsReport(dto.question);
    }
)