import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaClient, PurchaseReceiptStatus } from '@prisma/client';
import { APIError } from 'encore.dev/api';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom, map, timer } from 'rxjs';
import axios from 'axios';

import { CreatePurchaseReceiptsDto } from './dto';
import { PRISMA_CLIENT } from '../../core/database.symbols';
import { IGV, PaginationDto } from '../../common';
import { createPrismaFilter } from '../../common/functions';
import { CreatePurchaseReceiptsResponse, FindAllPurchaseReceiptsResponse } from './responses';
import { envs } from '../../config';
import { ReqBodyAskGpt } from './interfaces';
import { INSTRUCCIONES_ARMAR_FILTRO, INSTRUCCIONES_ARMAR_REPORTE } from './constants';

@Injectable()
export class PurchaseReceiptsService implements OnModuleInit {

  private readonly logger = new Logger(PurchaseReceiptsService.name);
  private readonly httpService: HttpService;

  constructor(
    @Inject(PRISMA_CLIENT) private readonly prisma: PrismaClient,
  ) {
    this.httpService = new HttpService(axios);
  }

  public onModuleInit() {
    this.prisma.$connect();
    this.logger.log('PurchaseReceiptsService initialized and connected to the database');
  }

  public async create(dto: CreatePurchaseReceiptsDto): Promise<CreatePurchaseReceiptsResponse> {
    const isValidRUC: boolean = await this.methodValidateRucIsValid(dto.supplier_ruc);
    if(!isValidRUC) throw APIError.invalidArgument('The provided RUC is not valid');
    const purchaseReceipt = await this.prisma.purchaseReceipt.create({
        data: {
            ...dto,
            igv: dto.amount * IGV,
            total: dto.amount + (dto.amount * IGV),
        }
    });
    return {
        ...purchaseReceipt,
        amount: Number(purchaseReceipt.amount),
        igv: Number(purchaseReceipt.igv),
        total: Number(purchaseReceipt.total),
    };
  }

  private async methodValidateRucIsValid(ruc: string): Promise<boolean> {
    return firstValueFrom(timer(3000).pipe(map(() => true)));
  }

  public async updateStatus(id: string, status: string): Promise<CreatePurchaseReceiptsResponse> {
    this.methodValidateStatusIsValid(status);
    const statusValidated = status as PurchaseReceiptStatus;
    
    const purchaseReceipt = await this.prisma.purchaseReceipt.findUnique({
        where: { id },
        select: { id: true, status: true }
    });
    if (!purchaseReceipt) throw APIError.notFound('Purchase receipt not found');
    if (purchaseReceipt.status === status) throw APIError.invalidArgument('The purchase receipt is already in the requested status');
    const updatedPurchaseReceipt = await this.prisma.purchaseReceipt.update({
        where: { id },
        data: { status: statusValidated },
    });
    return {
        ...updatedPurchaseReceipt,
        amount: Number(updatedPurchaseReceipt.amount),
        igv: Number(updatedPurchaseReceipt.igv),
        total: Number(updatedPurchaseReceipt.total),
    }
  }

  private async methodValidateStatusIsValid(status: string): Promise<void> {
    const estadosValidos = Object.values(PurchaseReceiptStatus);

    if (status === PurchaseReceiptStatus.PENDING)
      throw APIError.invalidArgument('The purchase receipt cannot be updated to PENDING status');

    if (!estadosValidos.includes(status as PurchaseReceiptStatus))
      throw APIError.invalidArgument(`Invalid status provided, must be one of: ${estadosValidos.join(', ')}`);
  }

  public async findAll(dto: PaginationDto): Promise<FindAllPurchaseReceiptsResponse> {
    const where = createPrismaFilter(dto)
    const total = await this.prisma.purchaseReceipt.count({
      where
    });
    if(!total) throw APIError.notFound('No purchase receipts found');
    const rows = await this.prisma.purchaseReceipt.findMany({
      where,
      skip: (dto.page - 1) * dto.limit,
      take: dto.limit,
      orderBy: { createdAt: 'desc' },
    });
    const data = rows.map(row => ({
        ...row,
        amount: Number(row.amount),
        igv: Number(row.igv),
        total: Number(row.total)
    }));

    return { data, meta: { total, page: dto.page, lastPage: Math.ceil(total / dto.limit) }  }
  }

  public async exportToCsv(dto: PaginationDto): Promise<{ csvString: string }> {
    const data = await this.findAll(dto);
    const csvHeaders = Object.keys(data.data[0]).join(',') + '\n';
    const csvRows = data.data.map(row => {
        return Object.values(row).map(value => {
            if (typeof value === 'string') {
                return `"${value.replace(/"/g, '""')}"`; // Escape quotes in strings
            }
            return value;
        }).join(',');
    });
    return { csvString: csvHeaders + csvRows.join('\n')}
  }

  public async methodAskGpt(question: string, instructions: string): Promise<string> {
    const headers = {
      'Authorization': `Bearer ${envs.API_KEY_OPENAI}`,
    }
    const reqBody: ReqBodyAskGpt = {
      input: question,
      instructions,
      model: 'gpt-4.1-nano'
    }
    const response = await firstValueFrom(this.httpService.post('https://api.openai.com/v1/responses', reqBody, { headers }));
    return response.data.output?.[0].content?.[0].text ?? '';
  }

  public async obtainPurchaseReceiptsReport(question: string): Promise<{ answer: string }> {
    const actualDate = new Date();
    actualDate.setHours(0, 0, 0, 0);
    const actualDateFormat = actualDate.toISOString().split('T')[0];
    const responseGptFiltros = await this.methodAskGpt(question, INSTRUCCIONES_ARMAR_FILTRO(actualDateFormat));
    if(!responseGptFiltros) throw APIError.internal('Error al consultar a GPT');
    const filtro = this.methodTransformResponseGptToPrismaFilter(responseGptFiltros) as unknown;
    if(typeof filtro !== 'object' || filtro === null) throw APIError.internal('El filtro obtenido de GPT no es un objeto válido');
    const data = await this.prisma.purchaseReceipt.findMany({
      where: { ...filtro },
      select: {
        status: true,
        total: true,
        document_type: true,
        issue_date: true,
        supplier_ruc: true,
        company_id: true,
        updatedAt: true,
      }
    });
    const questionToBuildReport = `${question}
    ** Datos **
    ${JSON.stringify(data)}`;
    const reporteFinal: string = await this.methodAskGpt(questionToBuildReport, INSTRUCCIONES_ARMAR_REPORTE);
    return { answer: reporteFinal };
  }

  private methodTransformResponseGptToPrismaFilter(response: string): Record<string, any> {
    const jsonMatch = response.match(/```json\n([\s\S]*?)\n```/);
    if(!jsonMatch) return JSON.parse(response);
    return JSON.parse(jsonMatch[1]);
  }

}
