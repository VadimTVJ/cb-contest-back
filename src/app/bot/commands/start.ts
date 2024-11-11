import { CommandContext, Context } from 'grammy';
import { userUseCases } from '../../use-cases/user';
import { purchasedGiftUseCases } from '../../use-cases/purchased-gift';

export const startCommandHandler = async (ctx: CommandContext<Context>) => {
  if (!ctx.from) return;

  await userUseCases.createUpdate({
    tgId: ctx.from.id,
    firstName: ctx.from.first_name,
    lastName: ctx.from.last_name,
    hasPremium: ctx.from.is_premium,
  });

  ctx.reply(
    '🎁 Here you can buy and send gifts to your friends.',
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

  const match = ctx.match.match(/^gift-(.+)$/);
  const activateHash = match ? match[1] : null;
  if (activateHash) {
    const { storeGift, customer } = await purchasedGiftUseCases.receive({
      activateHash,
      recipientTgId: ctx.from.id,
    });

    ctx.reply(
      `⚡ ${customer.firstName} has given you the gift of ${storeGift.name}.`,
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
  }
};
