FROM node:alpine

LABEL authors="Pankaj Sanam <pankaj.sanam@gmail.org>"

RUN mkdir -p /usr/src/node-app && chown -R node:node /usr/src/node-app

WORKDIR /usr/src/mint-express

COPY package*.json ./

USER node

RUN npm i

COPY --chown=node:node . .

EXPOSE 3000
