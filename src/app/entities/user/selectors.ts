import { Prisma } from '@prisma/client';
import { merge } from 'ts-deepmerge';
import { prismaClient } from '../../../infrastructure/db';
import { getLeaderboardPosition } from '../../leaderboard';

const defaultSelect = {
  id: true,
  firstName: true,
  lastName: true,
  hasPremium: true,
  avatarUrl: true,
  receivedGiftsCount: true,
  tgId: true,
} satisfies Prisma.UserFindManyArgs['select'];

export const selectUsers = (args: Prisma.UserFindManyArgs = {}) => {
  const mergedArgs = {
    ...args,
    select: merge(defaultSelect, args?.select || {}),
  } satisfies Prisma.UserFindManyArgs;

  return prismaClient.user.findMany(mergedArgs)
    .then((users) => Promise.all(users.map(async (user) => ({
      ...user,
      leaderboardPosition: await getLeaderboardPosition(user.tgId),
    }))));
};
