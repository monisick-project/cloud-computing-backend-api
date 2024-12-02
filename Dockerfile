FROM node:20-alpine

COPY package*.json ./

RUN npm install 

WORKDIR /app

COPY . .

CMD node index.js

EXPOSE 5000