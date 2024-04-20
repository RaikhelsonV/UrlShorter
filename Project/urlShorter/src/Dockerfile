FROM node:18-alpine
WORKDIR /usr/src/app

COPY . .

RUN npm ci

EXPOSE 3006

CMD ["node", "src/app.js"]