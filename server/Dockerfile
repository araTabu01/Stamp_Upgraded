# Use an official Node.js runtime as the base image

FROM node:20.17.0 AS builder
WORKDIR /app
COPY package*.json ./
COPY tsconfig.json ./
RUN npm install

COPY ./src ./src
COPY ./prisma ./prisma
RUN npx prisma generate
RUN npm run build

FROM node:20.17.0 AS runner

WORKDIR /app

# Copy only the necessary files from the build stage

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

# Command to run when the container starts
RUN npx prisma generate
CMD ["npm","start"]
