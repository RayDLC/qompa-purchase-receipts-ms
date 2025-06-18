import { PaginationInterface } from "./interfaces";

export function isValidPaginationDto(dto: PaginationInterface): void {
    if (!Number.isInteger(dto.page) || dto.page < 1)
        throw new Error("Page must be a positive integer.");

    if (!Number.isInteger(dto.limit) || dto.limit < 1)
        throw new Error("Limit must be a positive integer.");
}

export enum PrismaFilterOperators {
  Equal = 'eq',
  NotEqual = 'neq',
  In = 'in',
  Between = 'between',
  Contains = 'contains',
  StartsWith = 'startsWith',
  EndsWith = 'endsWith',
}

export function prismaConditionalOperator(operator: string, value: any) {
  switch (operator) {
    case PrismaFilterOperators.Equal:
      return { equals: value };
    case PrismaFilterOperators.NotEqual:
      return { not: value };
    case PrismaFilterOperators.In:
      return { in: value };
    case PrismaFilterOperators.Between:
      return { gte: value[0], lte: value[1] };
    case PrismaFilterOperators.Contains:
      return { contains: value };
    case PrismaFilterOperators.StartsWith:
      return { startsWith: value };
    case PrismaFilterOperators.EndsWith:
      return { endsWith: value };
    default:
      throw new Error(`Operador no válido: ${operator}`);
  }
}

export function createPrismaFilter(pg: {
  key?: string;
  operator?: string;
  value?: string;
}) {
  try {
    const keys = pg.key?.split(',');
    const operators = pg.operator?.split(',');
    const values = JSON.parse(pg.value || '[]');

    if (!keys || !operators || !values) return {};

    return keys.reduce((acc, key, i) => {
        acc[key] = prismaConditionalOperator(operators[i], values[i]);
        return acc;
    }, {} as Record<string, any>);
  } catch (error) {
    throw new Error(`Error creating Prisma filter: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}