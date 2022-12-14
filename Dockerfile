FROM node:18-alpine as build

WORKDIR /app

COPY package.json /app/package.json
COPY yarn.lock /app/yarn.lock

RUN yarn install --ignore-scripts

COPY src/ /app/src
COPY tests/ /app/tests
COPY tsconfig.json /app/tsconfig.json

RUN yarn build

# ---
FROM node:18-alpine

WORKDIR /app

COPY --from=build /app/dist/ /app

VOLUME /app/config
VOLUME /app/logs

CMD ["node", "/app/index.cjs"]
