## cb-contest-back

#### Стек
- typescript
- mysql + prisma
- fastify
- grammy
---
#### Требования
- nodejs 18+
- mysql 8+
---
#### .env
- `DATABASE_URL` — строка для подключения в БД в DSN формате (`mysql://user:password@server:port/db`)
- `PORT` — порт веб-сервера
- `HOST` — хост веб-сервера
- `TG_ENV` (`prod`|`test`) — окружение, в котором будет запущен Telegram бот
- `TG_BOT_TOKEN` — токен от Telegram бота
- `TG_BOT_USERNAME` — юзернейм бота
- `TG_WEBAPP_URL` — ссылка на веб-апп
- `CB_TOKEN` — токен от CryptoPay API
---
#### Команды
- `yarn build` & `yarn start` — сборка и запуск проекта
- `yarn dev` — запуск дев-сервера
