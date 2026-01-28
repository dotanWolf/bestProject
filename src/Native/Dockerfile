FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

# Install ngrok for tunnel support
RUN npm install -g @expo/ngrok

COPY . .

# Expose Expo ports
EXPOSE 8081 19000 19001 19002

# Run with tunnel so your phone can connect
CMD ["npx", "expo", "start", "--tunnel"]