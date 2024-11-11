import { grammyInstance } from '../../infrastructure/grammy';
import { startCommandHandler } from './commands';
import { giftQueriesHandler } from './inline-queries';

export const createBot = () => {
  // Commands
  grammyInstance.command('start', startCommandHandler);

  // Inline queries
  grammyInstance.inlineQuery(/gift-.*/, giftQueriesHandler);

  return grammyInstance;
};
