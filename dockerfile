FROM node:16.13.0-alpine3.14

WORKDIR /server

COPY package*.json ./

RUN npm install

COPY . .

ENV EXPRESS_PORT=8080

EXPOSE 8080

CMD [ "npm", "run", "dev" ]
