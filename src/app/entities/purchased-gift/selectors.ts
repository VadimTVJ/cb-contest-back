import { Prisma } from '@prisma/client';
import { merge } from 'ts-deepmerge';
import createHttpError from 'http-errors';
import { prismaClient } from '../../../infrastructure/db';

const defaultSelect = {
  id: true,
  index: true,
  purchasedDate: true,
  receivedDate: true,
  storeGift: {
    select: {
      id: true,
      name: true,
      lottieUrl: true,
      price: true,
      asset: {
        select: {
          name: true,
        },
      },
      totalQuantity: true,
    },
  },
  customer: {
    select: {
      firstName: true,
      lastName: true,
      avatarUrl: true,
      hasPremium: true,
    },
  },
} satisfies Prisma.PurchasedGiftFindManyArgs['select'];

export const selectPurchasedGifts = (args: Prisma.PurchasedGiftFindManyArgs = {}) => {
  const mergedArgs = {
    ...args,
    select: merge(defaultSelect, args?.select || {}),
  } satisfies Prisma.PurchasedGiftFindManyArgs;

  return prismaClient.purchasedGift.findMany(mergedArgs);
};

export const selectActivateHash = async (purchasedGiftId: number, tgId: number) => {
  const purchasedGift = await prismaClient.purchasedGift.findUnique({
    where: { id: purchasedGiftId, customerTgId: tgId },
  });
  if (!purchasedGift) throw createHttpError(404, 'Purchased Gift not found');
  if (purchasedGift.recipientTgId) throw createHttpError(400, 'Gift already activated');

  return purchasedGift.activateHash;
};
