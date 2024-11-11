import { Prisma } from '@prisma/client';
import { merge } from 'ts-deepmerge';
import { prismaClient } from '../../../infrastructure/db';

const defaultSelect = {
  id: true,
  name: true,
  previewGradientFrom: true,
  previewGradientTo: true,
  price: true,
  asset: {
    select: {
      id: true,
      appearanceColor: true,
      name: true,
    },
  },
  totalQuantity: true,
  purchasedQuantity: true,
  lottieUrl: true,
} satisfies Prisma.StoreGiftFindManyArgs['select'];

export const selectStoreGifts = (args: Prisma.StoreGiftFindManyArgs = {}) => {
  const mergedArgs = {
    ...args,
    select: merge(defaultSelect, args?.select || {}),
  } satisfies Prisma.StoreGiftFindManyArgs;

  return prismaClient.storeGift.findMany(mergedArgs);
};
