FROM node:16-alpine as builder

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . . 

RUN npm run build


FROM node:16-alpine as runner

WORKDIR /usr/src/app

COPY package*.json ./

COPY migrations ./migrations

RUN npm ci --omit=dev

COPY --from=builder /usr/src/app/dist ./dist
COPY .env ./
COPY .env ./dist
COPY newrelic.js ./dist
COPY newrelic.js ./


EXPOSE 80 

CMD ["node","-r","newrelic", "dist/index.js"]
