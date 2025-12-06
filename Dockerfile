# in order to build this dockerfile go to the root directory (bestProject)
# then run: docker build -t app .

# then run it using: docker run -it -v files:/app/data app

FROM gcc:latest
RUN apt-get update && apt-get install -y cmake

# Create the environment variable with the path
# This ENV is critical for the C++ application's file management logic
ENV RLE_DIR=/app/data 
RUN mkdir -p /app/data

# Copy all source files including headers
COPY . /usr/src/myproject
WORKDIR /usr/src/myproject

# Standard CMake build steps
RUN mkdir build
WORKDIR /usr/src/myproject/build
RUN cmake .. && make

# The CMD to run the server executable with a port argument.
CMD ["./MyProject", "8080"]