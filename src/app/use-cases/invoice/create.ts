import { StoreGift } from '@prisma/client';
import createHttpError from 'http-errors';
import { prismaClient } from '../../../infrastructure/db';
import { cbApi, CBApiAsset } from '../../../infrastructure/crypto-bot-api';

type Params = {
  storeGiftId: StoreGift['id'];
  tgId: number;
};

export const create = async ({ storeGiftId, tgId }: Params) => {
  const storeGift = await prismaClient.storeGift.findUnique({
    select: {
      id: true,
      name: true,
      price: true,
      asset: {
        select: {
          assetCode: true,
        },
      },
    },
    where: { id: storeGiftId },
  });
  if (!storeGift) throw createHttpError(404, 'StoreGift not found');

  const userExists = await prismaClient.user.count({
    where: { tgId },
  });
  if (!userExists) throw createHttpError(404, 'User not found');

  const invoice = await cbApi.createInvoice({
    asset: storeGift.asset.assetCode as CBApiAsset,
    amount: storeGift.price.toString(),
    description: `Purchasing a ${storeGift.name} gift`,
  });

  await prismaClient.invoice.create({
    data: {
      tgId,
      storeGiftId,
      invoiceHash: invoice.hash,
      invoiceId: invoice.invoice_id,
      status: 'active',
    },
  });

  return invoice;
};
