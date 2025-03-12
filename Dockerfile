 # Use the official Node.js image as the base image
FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

COPY tsconfig*.json ./

RUN npm install --force

ENV JWT_SECRET=DevIgnite2
ENV DATABASE_URL=mongodb+srv://AaronOtu:Dun%40m1%2499@nodejsexpressproject.3wc7g.mongodb.net/invoice-service



COPY . .

EXPOSE 3000

CMD ["npm", "run", "start"]