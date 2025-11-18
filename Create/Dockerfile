FROM gcc:latest

RUN apt-get update && apt-get install -y cmake

# Create test directory
RUN mkdir -p /rle_test_dir
# Set environment variable for your tests
ENV RLE_DIR=/rle_test_dir

COPY . /usr/src/mytest
WORKDIR /usr/src/mytest

RUN mkdir build
WORKDIR /usr/src/mytest/build

RUN cmake .. && make

CMD ["./runTests"]