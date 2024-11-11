import { Bot } from 'grammy';

export const grammyInstance = new Bot(process.env.TG_BOT_TOKEN as string, {
  client: {
    environment: process.env.TG_ENV === 'prod' ? 'prod' : 'test',
  },
});
