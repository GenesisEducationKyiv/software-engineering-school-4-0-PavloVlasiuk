# build

FROM node:18-alpine as build

WORKDIR /app

COPY --chown=node:node package*.json ./
COPY --chown=node:node prisma ./prisma/

RUN npm ci

COPY --chown=node:node . .

RUN npx prisma generate

RUN npm run build

# run

FROM node:18-alpine

WORKDIR /app

COPY --chown=node:node --from=build /app/node_modules ./node_modules
COPY --chown=node:node --from=build /app/prisma ./prisma
COPY --chown=node:node --from=build /app/.env .
COPY --chown=node:node --from=build /app/dist ./dist
COPY --chown=node:node --from=build /app/package.json .

EXPOSE 3000

CMD ["npm", "run", "start:migrate:prod"]