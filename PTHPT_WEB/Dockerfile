FROM node:18-alpine

WORKDIR /app

COPY package.json .

RUN npm install

COPY app/ .

CMD ["npx", "nodemon" , "app/index.js"]
