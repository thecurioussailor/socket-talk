FROM node:lts-alpine

WORKDIR /app

RUN npm install -g pnpm

COPY pnpm-lock.yaml package.json turbo.json pnpm-workspace.yaml ./
COPY apps/db-service/package.json apps/db-service/
COPY packages/prisma/package.json packages/prisma/

RUN pnpm install --frozen-lockfile

COPY packages/prisma/ packages/prisma/

WORKDIR /app/packages/prisma
RUN pnpm prisma generate

WORKDIR /app

COPY apps/db-service/ apps/db-service/

RUN pnpm --filter db-service run build

CMD ["pnpm", "--filter", "db-service", "run", "start"]