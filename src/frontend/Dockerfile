# docker build -t frontend .
# docker run -p 5173:5173 frontend 

FROM node:20-bookworm-slim
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Vite usually runs on 5173
EXPOSE 5173

# Use --host to allow external connections (from your browser)
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]