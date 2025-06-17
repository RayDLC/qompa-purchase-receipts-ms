import { PrismaClient } from '@prisma/client';
import { PRISMA_CLIENT } from './database.symbols';

export const databaseProviders = [
  {
    provide: PRISMA_CLIENT,
    useFactory: () => new PrismaClient()
  },
];