FROM node:lts-alpine

WORKDIR /app

RUN npm install -g pnpm

COPY pnpm-lock.yaml package.json turbo.json pnpm-workspace.yaml ./
COPY apps/ws-server/package.json apps/ws-server/
COPY packages/prisma/package.json packages/prisma/

RUN pnpm install --frozen-lockfile

COPY packages/prisma/ packages/prisma/

WORKDIR /app/packages/prisma
RUN pnpm prisma generate

WORKDIR /app
COPY apps/ws-server/ apps/ws-server/

RUN pnpm --filter ws-server run build

EXPOSE 3000


CMD ["pnpm", "--filter", "ws-server", "run", "start"]