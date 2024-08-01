# build

FROM node:18-alpine as build

WORKDIR /app

COPY --chown=node:node package*.json ./

RUN npm ci --only=production && npm cache clean --force

COPY --chown=node:node . .

RUN npm run build

# run

FROM node:18-alpine

WORKDIR /app

COPY --chown=node:node --from=build /app/mail/templates ./mail/templates
COPY --chown=node:node --from=build /app/.env .
COPY --chown=node:node --from=build /app/dist ./dist
COPY --chown=node:node --from=build /app/node_modules ./node_modules

CMD [ "node", "dist/main.js" ]