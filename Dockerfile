FROM node:18

WORKDIR /app

COPY package*.json ./

ENV NODE_ENV development

RUN npm install

COPY . .

CMD ["npx", "nodemon", "server.js"]
