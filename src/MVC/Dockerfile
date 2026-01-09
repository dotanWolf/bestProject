# docker build -t api .
# docker run -p 8080:8080 api

FROM node:20-bookworm

WORKDIR /usr/src/myproject

COPY package*.json ./

RUN npm ci --only=production

COPY . .

EXPOSE 8080

CMD ["node", "webServer.js"]