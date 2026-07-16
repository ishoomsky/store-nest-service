# CLAUDE.md — store-nest-service

Backend интернет-магазина Store. Часть набора из трёх независимых репозиториев
(см. `../CLAUDE.md`).

## О проекте

NestJS 10 + Prisma 5 + PostgreSQL. REST API с документацией Swagger.

Модули (`src/`):
- `articles` — CRUD статей + `GET /articles/drafts` (`ParseIntPipe`, `NotFoundException`).
- `products` — CRUD товаров (id — `cuid`, строка).
- `prisma` — глобальный `PrismaModule` + `PrismaService`.
- `prisma-client-exception` — глобальный фильтр, маппит ошибки Prisma в HTTP-ответы.

`main.ts`: глобальный `ValidationPipe`, Swagger на `/api`, порт **3000**.

## Команды

- Установка: `npm install` (postinstall дёргает `prisma generate`).
- Dev: `npm run start:dev` (watch) → `http://localhost:3000`, Swagger `http://localhost:3000/api`.
- Сборка/прод: `npm run build`, `npm run start:prod`.
- Линт/формат: `npm run lint`, `npm run format`.
- Тесты: `npm test` (jest), `npm run test:e2e`.
- Prisma: `npx prisma generate`, `npx prisma migrate dev`, `npx prisma migrate status`, `npx prisma db seed`.

## База данных

- Строка подключения — в `.env` (`DATABASE_URL`), указывает на базу `store` в докере
  (`myuser:mypassword@localhost:5434/store`). Postgres поднимается из корня: `docker compose up -d`.
- Схема — `prisma/schema.prisma`. Модели: `User`, `Article`, `Product`.
- Seed — `prisma/seed.ts` (идемпотентный `upsert`: 2 юзера, 3 статьи, 2 товара). Запуск: `npx prisma db seed`.

## Конвенции

- Модульная структура NestJS; `PrismaModule` глобальный; общий `ValidationPipe`.
- DTO — с `class-validator`/`class-transformer`; entity-классы (`entities/*.entity.ts`) — для схем Swagger.
- **TypeScript strict**. Prettier — `.prettierrc` (`singleQuote`, `trailingComma: all`).
- **Prisma-миграции** применяются лексикографически по имени папки — следить за хронологией таймстемпов.

## Известные пробелы

- **Пароли в открытом виде** (в `seed.ts` и модели `User`) — исправляется вместе с задачей auth
  (bcrypt + JWT + guards). Auth-эндпоинтов сейчас нет.
- Версии (Nest 10 / Prisma 5.15 / postgres:13.5) устарели — апгрейд отдельной задачей.

## Структура

```
src/
  main.ts, app.module.ts
  articles/   # controller, service, dto/, entities/
  products/   # controller, service, dto/, entities/
  prisma/     # module + service (глобальный)
  prisma-client-exception/  # exception filter
prisma/
  schema.prisma, seed.ts, migrations/
```
