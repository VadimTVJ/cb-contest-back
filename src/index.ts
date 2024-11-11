import { createApiServer } from './app/api/create-api-server';
import { checkDatabaseConnection } from './infrastructure/db';
import { createBot } from './app/bot/create-bot';
import { syncLeaderboard } from './app/leaderboard';

const port = Number(process.env.PORT) || 3000;
const host = process.env.HOST;

(async () => {
  await checkDatabaseConnection()
    .then(() => console.log('[db] Connected'));

  // Telegram bot
  const bot = createBot();
  bot.start({
    onStart: () => console.log('[bot] Started'),
  });

  // Api server
  const apiServer = createApiServer();
  apiServer.listen({ port, host }, (error, address) => {
    if (error) {
      console.log('[api error]', error);
      process.exit(1);
    }

    console.log(`[api] Running at ${address}`);
  });

  // Фоновое обновление лидерборда
  syncLeaderboard();
  setInterval(() => {
    syncLeaderboard();
  }, 10_000);
})();
