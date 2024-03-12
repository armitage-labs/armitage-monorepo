FROM node:16.19-alpine

WORKDIR /app
RUN apk add git

COPY cred-manager/package.json /app/package.json
COPY cred-manager/yarn.lock /app/yarn.lock

RUN yarn install --ignore-scripts --frozen-lockfile

COPY cred-manager/ /app/

COPY .env /app/.env

RUN yarn prisma db push
RUN yarn build

RUN git clone https://github.com/armitage-labs/source-cred-instance /instance

COPY .env /instance/.env

WORKDIR /instance
RUN yarn install

WORKDIR /app

EXPOSE 8080

CMD ["yarn", "start"]
