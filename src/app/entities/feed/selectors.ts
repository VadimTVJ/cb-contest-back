import { Prisma } from '@prisma/client';
import { merge } from 'ts-deepmerge';
import { prismaClient } from '../../../infrastructure/db';

const defaultSelect = {
  id: true,
  action: true,
  purchasedGift: {
    select: {
      storeGift: {
        select: {
          id: true,
          name: true,
          price: true,
          asset: {
            select: {
              name: true,
            },
          },
        },
      },
      customer: {
        select: {
          firstName: true,
          lastName: true,
          tgId: true,
          avatarUrl: true,
        },
      },
      recipient: {
        select: {
          firstName: true,
          lastName: true,
          tgId: true,
          avatarUrl: true,
        },
      },
    },
  },
} satisfies Prisma.FeedFindManyArgs['select'];

export const select = (args: Prisma.FeedFindManyArgs = {}) => {
  const mergedArgs = {
    ...args,
    select: merge(defaultSelect, args?.select || {}),
  } satisfies Prisma.FeedFindManyArgs;

  return prismaClient.feed.findMany(mergedArgs);
};
