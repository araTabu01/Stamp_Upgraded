
#Stage 1
FROM node:18.18.0 as builder
WORKDIR /app
COPY package*.json .

RUN npm install

COPY . .

EXPOSE 3020

CMD ["npm","run","start"]
