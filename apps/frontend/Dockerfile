FROM node:lts-alpine

WORKDIR /app

RUN npm install -g pnpm

COPY pnpm-lock.yaml package.json turbo.json pnpm-workspace.yaml ./
COPY apps/frontend/package.json apps/frontend/

RUN pnpm install --frozen-lockfile


COPY apps/frontend/ apps/frontend/

CMD ["pnpm", "--filter", "frontend", "run", "dev", "--host"]





