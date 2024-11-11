import { Invoice, Prisma } from '@prisma/client';
import { merge } from 'ts-deepmerge';
import createHttpError from 'http-errors';
import { prismaClient } from '../../../infrastructure/db';

const defaultSelect = {
  id: true,
  status: true,
  invoiceId: true,
  invoiceHash: true,
  createdAt: true,
  tgId: true,
  storeGiftId: true,
  updatedAt: true,
} satisfies Prisma.InvoiceFindManyArgs['select'];

export const selectInvoices = (args: Prisma.InvoiceFindManyArgs = {}) => {
  const mergedArgs = {
    ...args,
    select: merge(defaultSelect, args?.select || {}),
  } satisfies Prisma.InvoiceFindManyArgs;

  return prismaClient.invoice.findMany(mergedArgs);
};

export const selectStatus = async (invoiceId: Invoice['invoiceId']) => {
  const invoice = await prismaClient.invoice.findUnique({
    where: { invoiceId },
  });
  if (!invoice) throw createHttpError(404, 'Invoice not found');
  return invoice.status;
};
