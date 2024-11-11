import { grammyInstance } from '../../../infrastructure/grammy';

type Params = {
  customerTgId: number;
  recipientName: string;
  giftName: string
};

export const sendGiftReceivedMessage = ({ recipientName, giftName, customerTgId }: Params) => {
  return grammyInstance.api.sendMessage(
    customerTgId,
    `👌 ${recipientName} received your gift of ${giftName}.`,
    {
      reply_markup: {
        inline_keyboard: [[
          {
            text: 'Open App',
            web_app: { url: process.env.TG_WEBAPP_URL as string },
          },
        ]],
      },
    },
  );
};
