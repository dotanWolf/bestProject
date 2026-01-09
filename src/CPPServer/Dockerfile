# docker build -t cpp-server .
# docker run -p 9120:9120 -v files:/app/data cpp-server

FROM gcc:latest
RUN apt-get update && apt-get install -y cmake

# Create the environment variable with the path
# This ENV is critical for the C++ application's file management logic
ENV THREAD_POOL_SIZE=5

ENV RLE_DIR=/app/data 
RUN mkdir -p /app/data

# Copy all source files including headers
COPY . /usr/src/myproject
WORKDIR /usr/src/myproject

# Standard CMake build steps
RUN mkdir build
WORKDIR /usr/src/myproject/build
RUN cmake .. && make

EXPOSE 9120

# The CMD to run the server executable with a port argument.
CMD ["./MyProject", "9120"]