import createHttpError from 'http-errors';
import { prismaClient } from '../../../infrastructure/db';
import { sendGiftReceivedMessage } from '../../bot/messages';

type Params = {
  activateHash: string;
  recipientTgId: number;
};

export const receive = async ({ activateHash, recipientTgId }: Params) => {
  let purchasedGift = await prismaClient.purchasedGift.findUnique({
    where: { activateHash },
  });
  if (!purchasedGift) throw createHttpError(404, 'Purchased Gift not found');
  if (purchasedGift.recipientTgId) throw createHttpError(400, 'Gift already received');

  const storeGift = await prismaClient.storeGift.findUnique({
    where: { id: purchasedGift.storeGiftId },
  });
  if (!storeGift) throw createHttpError(404, 'Store Gift not found');

  const customer = await prismaClient.user.findUnique({
    where: { tgId: purchasedGift.customerTgId },
  });
  if (!customer) throw createHttpError(404, 'Sender not found');

  const recipient = await prismaClient.user.findUnique({
    where: { tgId: recipientTgId },
  });
  if (!recipient) throw createHttpError(404, 'Recipient not found');

  await prismaClient.$transaction(async (tx) => {
    purchasedGift = await tx.purchasedGift.update({
      where: { activateHash },
      data: {
        recipientTgId,
        receivedDate: new Date(),
      },
    });

    await tx.user.update({
      where: { tgId: recipientTgId },
      data: {
        receivedGiftsCount: {
          increment: 1,
        },
      },
    });

    await tx.feed.create({
      data: {
        action: 'sent_gift',
        purchasedGiftId: purchasedGift.id,
        tgId: customer.tgId,
      },
    });

    await tx.feed.create({
      data: {
        action: 'receive_gift',
        purchasedGiftId: purchasedGift.id,
        tgId: recipientTgId,
      },
    });
  });

  sendGiftReceivedMessage({
    customerTgId: Number(purchasedGift.customerTgId),
    giftName: storeGift.name,
    recipientName: recipient.firstName,
  });

  return {
    purchasedGift, storeGift, recipient, customer,
  };
};
