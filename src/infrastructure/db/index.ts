import { PrismaClient } from '@prisma/client';

export const prismaClient = new PrismaClient({
  log: ['warn', 'error'],
});

export const checkDatabaseConnection = () => prismaClient.$queryRaw`SELECT 1`;
