
#Stage 1
FROM node:18.18.0 as builder
WORKDIR /app
COPY package*.json .

RUN npm install

COPY . .


CMD ["npm","run","start"]
