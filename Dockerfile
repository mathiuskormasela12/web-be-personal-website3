FROM node:18-alpine

WORKDIR /app

ARG SERVICE_PORT_ARG=9000

# Copy all required files to build the Nest Js App
COPY ./package.json ./package.json
COPY ./public ./public
COPY ./src ./src
COPY ./tsconfig.json ./tsconfig.json
COPY ./tsconfig.build.json ./tsconfig.build.json
COPY ./nest-cli.json ./nest-cli.json

# Install node packages and then build the Nesj Js app
RUN npm install 
RUN npm run build

# Copy the built folder
COPY ./dist ./dist

# Remove unnecessary files & folder
RUN rm -rf ./node_modules
RUN rm -rf ./package-lock.json
RUN rm -rf ./src
RUN rm -rf ./tsconfig.json
RUN rm -rf ./tsconfig.build.json
RUN rm -rf ./nest-cli.json

RUN npm install --production

EXPOSE 8081/tcp

ENV SERVICE_PORT=${SERVICE_PORT_ARG}

CMD npm run start:prod