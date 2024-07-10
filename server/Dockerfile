# Use an official Node.js runtime as the base image

FROM node:18.18.0 AS builder
WORKDIR /app
COPY package*.json ./
COPY tsconfig.json ./
RUN npm install

COPY ./src ./src
COPY ./prisma ./prisma
RUN npx prisma generate
RUN npm run build

FROM node:latest as runner

WORKDIR /app

# Copy only the necessary files from the build stage

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
EXPOSE 5020

# Command to run when the container starts

CMD ["npm","start"]