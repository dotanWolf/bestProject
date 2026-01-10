# in order to build this dockerfile go to the root directory (bestProject)
# then run: docker build -f tests/getCommandTests/Dockerfile -t getcommand-tests .

# then run it using: docker run getcommand-tests

FROM gcc:latest

RUN apt-get update && apt-get install -y cmake

# Copy the ENTIRE project into the container
COPY . /usr/src/myproject

ENV RLE_DIR=/usr/src/myproject/rle
RUN mkdir -p /usr/src/myproject/rle

# Move into the test folder
WORKDIR /usr/src/myproject/tests/getCommandTests/build

# Configure + build
RUN mkdir -p build
WORKDIR /usr/src/myproject/tests/getCommandTests/build
RUN cmake .. && make

CMD ["./rungetCommandTests"]