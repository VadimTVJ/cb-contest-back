import { Context, InlineQueryMiddleware } from 'grammy';
import { prismaClient } from '../../../infrastructure/db';

export const giftQueriesHandler:InlineQueryMiddleware<Context> = async (ctx) => {
  const match = ctx.inlineQuery.query.match(/^gift-(.+)$/);
  const activateHash = match ? match[1] : null;
  if (!activateHash) return;

  const purchasedGift = await prismaClient.purchasedGift.findUnique({
    select: {
      storeGift: true,
    },
    where: {
      activateHash,
      customerTgId: ctx.from.id,
      recipientTgId: null,
    },
  });
  if (!purchasedGift) return;

  ctx.answerInlineQuery([{
    type: 'article',
    id: activateHash,
    title: 'Send Gift',
    description: `Send a gift of ${purchasedGift.storeGift.name}.`,
    input_message_content: {
      message_text: '🎁 I have a gift for you! Tap the button below open it.',
    },
    reply_markup: {
      inline_keyboard: [[
        {
          text: '🎁 Receive gift',
          url: `https://t.me/${process.env.TG_BOT_USERNAME}?start=${ctx.inlineQuery.query}`,
        },
      ]],
    },
  }], {
    cache_time: 0,
    is_personal: true,
  });
};
