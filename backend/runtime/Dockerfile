FROM node:20-slim

WORKDIR /app

COPY package.json .
RUN npm install

COPY server.js .

EXPOSE 8642

CMD ["node", "server.js"]
