FROM node:18 as build

WORKDIR /app

COPY package.json /app/package.json
COPY yarn.lock /app/yarn.lock

RUN yarn install

COPY src/ /app/src

RUN yarn build

# ---
FROM node:18

WORKDIR /app

COPY --from=build /app/dist/ /app

VOLUME /app/config
VOLUME /app/logs

EXPOSE 80

CMD ["node", "/app/index.js"]
