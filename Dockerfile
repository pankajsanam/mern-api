FROM node:14.15.3-alpine3.12

RUN mkdir -p /home/mint-express

RUN chown node /home/mint-express

USER node

WORKDIR /home/mint-express

COPY --chown=node package*.json ./

RUN npm install

COPY --chown=node . /home/mint-express

ENV PATH /home/mint-express/node_modules/.bin:$PATH
ENV PORT=3000

EXPOSE ${PORT}

CMD ["npm", "start"]
