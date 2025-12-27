# use a node js base image
FROM node:20-bookworm

# Install C++ compiler tools directly into this  image
# This ensures the compiler and the runtime share the same libraries
RUN apt-get update && apt-get install -y \
    build-essential \
    cmake \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /usr/src/myproject

# Copy everything
COPY . .

# Build the C++ Server
RUN mkdir -p build && cd build && cmake .. && make

# Setup the Node.js MVC dependencies
WORKDIR /usr/src/myproject/src/MVC
RUN npm ci --only=production

# create an environment variable
ENV RLE_DIR=/app/data 
ENV THREAD_POOL_SIZE=5

RUN mkdir -p /app/data

# Final setup
WORKDIR /usr/src/myproject
EXPOSE 9120 8080

CMD ["node", "src/MVC/webServer.js"]