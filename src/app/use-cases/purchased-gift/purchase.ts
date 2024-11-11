import createHttpError from 'http-errors';
import { v4 as uuidv4 } from 'uuid';
import { prismaClient } from '../../../infrastructure/db';

type Params = {
  invoiceId: number;
};

export const purchase = async ({ invoiceId }: Params) => {
  const invoice = await prismaClient.invoice.findUnique({
    where: { invoiceId },
  });
  if (!invoice) throw createHttpError(404, 'Invoice not found');
  const { storeGiftId, tgId } = invoice;

  const storeGift = await prismaClient.storeGift.findUnique({
    where: { id: storeGiftId },
  });
  if (!storeGift) throw createHttpError(404, 'Store Gift not found');
  const { purchasedQuantity, totalQuantity } = storeGift;

  if (purchasedQuantity + 1 > totalQuantity) {
    // todo предусмотреть флоу при перерасходе лимита
    throw createHttpError(400);
  }

  await prismaClient.$transaction(async (tx) => {
    await tx.invoice.update({
      data: {
        status: 'paid',
      },
      where: { invoiceId },
    });

    const purchasedGift = await tx.purchasedGift.create({
      data: {
        customerTgId: tgId,
        storeGiftId,
        index: purchasedQuantity + 1,
        purchasedDate: new Date(),
        activateHash: uuidv4(),
      },
    });

    await tx.storeGift.update({
      data: {
        purchasedQuantity: {
          increment: 1,
        },
      },
      where: {
        id: storeGiftId,
      },
    });

    await tx.feed.create({
      data: {
        action: 'buy_gift',
        purchasedGiftId: purchasedGift.id,
        tgId: purchasedGift.customerTgId,
      },
    });
  });
};
