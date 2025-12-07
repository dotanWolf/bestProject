# in order to build this dockerfile go to the root directory (bestProject)
# then run: docker build -t app .

# then run it using: docker run --init --rm -it -p [portnumber]:[portnumber] -v files:/app/data app /usr/src/myproject/build/MyProject [portnumber]
#example-docker run --init --rm -it -p 9120:9120 -v files:/app/data app /usr/src/myproject/build/MyProject 9120

# Run Client (in a new terminal)
#docker run --rm -it --init --network host app /usr/src/myproject/build/ClientApp 127.0.0.1 9120
#docker run --rm -it --network host -v .:/app python:latest python /app/src/cpp/Client.py 127.0.0.1 9120
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
CMD ["./MyProject"]