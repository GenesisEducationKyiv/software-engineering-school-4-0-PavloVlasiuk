# build

FROM node:18-alpine as build

WORKDIR /

COPY --chown=node:node proto/* ./

COPY --chown=node:node package*.json ./app

RUN npm ci --only=production && npm cache clean --force

COPY --chown=node:node . ./app

RUN npm run build

# run

FROM node:18-alpine

WORKDIR /

COPY --chown=node:node --from=build /proto .
COPY --chown=node:node --from=build /app/.env ./app
COPY --chown=node:node --from=build /app/dist ./dist
COPY --chown=node:node --from=build /app/node_modules ./node_modules

CMD [ "node", "dist/main.js" ]