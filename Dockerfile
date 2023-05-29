FROM node:18-alpine

WORKDIR /user/app

ARG SERVICE_PORT_ARG=9000

COPY ./package.json ./package.json
COPY ./dist ./dist

RUN npm install --production

EXPOSE 8081/tcp

ENV SERVICE_PORT=${SERVICE_PORT_ARG}

CMD npm run start:prod