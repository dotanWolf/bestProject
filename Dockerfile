# in order to build this dockerfile go to the root directory (bestProject)
# then run: docker build -t server-client-app .

FROM gcc:latest

RUN apt-get update && apt-get install -y cmake 

# --- Setup for Application ---

# Create the environment variable and the data directory for the compressor
ENV RLE_DIR=/app/data
RUN mkdir -p ${RLE_DIR}

# Copy all source files including headers and tests
COPY . /usr/src/myproject
WORKDIR /usr/src/myproject

# --- Build Phase (including tests) ---

RUN mkdir build
WORKDIR /usr/src/myproject/build

# Assuming your CMakeLists.txt is set up to build a server executable named ServerMain 
# and a client executable named Client, and a test executable named runserverTests.
RUN cmake .. && make

CMD ["./MyProject", "8080"]