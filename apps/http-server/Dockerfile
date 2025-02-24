#base image for node
FROM node:lts-alpine
#working directory for copying
WORKDIR /app
#installing pnpm globally
RUN npm install -g pnpm

#Copy package manager files for caching
COPY pnpm-lock.yaml package.json turbo.json pnpm-workspace.yaml ./
COPY apps/http-server/package.json apps/http-server/
COPY packages/prisma/package.json packages/prisma/

RUN pnpm install --frozen-lockfile

COPY packages/prisma/ packages/prisma/

WORKDIR /app/packages/prisma
RUN pnpm prisma generate

WORKDIR /app
COPY apps/http-server apps/http-server

RUN pnpm --filter http-server run build

EXPOSE 3000

CMD ["pnpm", "--filter", "http-server", "run", "start"]

