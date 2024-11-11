import { prismaClient } from '../../infrastructure/db';

let leaderboard: number[] = [];

// Упрощенное решение для хранения лидерборд-позиций юзеров.
// Хранение в памяти поскольку это тестовый апп, в проде необходимо подключение редиса
export const syncLeaderboard = async () => {
  const sortedUsers = await prismaClient.user.findMany({
    orderBy: {
      receivedGiftsCount: 'desc',
    },
  });
  leaderboard = sortedUsers.map(({ tgId }) => tgId);
};

export const getLeaderboardPosition = (tgId: number) => leaderboard.findIndex((val) => val === tgId) + 1;
