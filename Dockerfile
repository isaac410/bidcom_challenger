FROM node:latest AS development

WORKDIR /app

RUN yarn add global @nestjs/cli

RUN yarn install --only=development
RUN yarn install --only=production

COPY . .

RUN yarn build

FROM node:latest AS production

WORKDIR /app

RUN yarn add global @nestjs/cli

COPY package.json yarn.lock ./

COPY --from=development /app/node_modules ./node_modules
COPY --from=development /app/dist ./dist

EXPOSE 4000

CMD [ "yarn", "run", "start:prod" ]

ENV MONGODB_HOST=$MONGODB_HOST
