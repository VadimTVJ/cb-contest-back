import { User } from '@prisma/client';
import { prismaClient } from '../../../infrastructure/db';

type Params = {
  tgId: number;
  firstName: string;
  lastName?: string;
  hasPremium?: boolean;
};

export const createUpdate = async ({
  tgId, firstName, lastName, hasPremium = false,
}: Params): Promise<{ user: User; isNew: boolean; }> => {
  let user = await prismaClient.user.findUnique({
    where: { tgId },
  });
  if (user) return { user, isNew: false };

  // Для отображения аватарок пользователей необходимо класть из в s3.
  // В рамках конкурсного задания я отпустил этот момент
  // const profilePhotos = await botInstance.api.getUserProfilePhotos(tgId);

  user = await prismaClient.user.create({
    data: {
      tgId,
      firstName,
      lastName,
      avatarUrl: '',
      hasPremium,
    },
  });
  return { user, isNew: true };
};
