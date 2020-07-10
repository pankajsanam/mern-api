FROM node:12
WORKDIR /www/node-express-mongodb-boilerplate
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
