# in order to build this dockerfile go to the root directory (bestProject)
# then run: docker build -f tests/fileCreationTests/Dockerfile -t creation-tests .

# then run it using: docker run creation-tests

FROM gcc:latest

RUN apt-get update && apt-get install -y cmake

# Create test directory
RUN mkdir -p /rle_test_dir
# Set environment variable for your tests
ENV RLE_DIR=/rle_test_dir

# Copy the ENTIRE project into the container
COPY ../.. /usr/src/myproject
WORKDIR /usr/src/myproject/tests/fileCreationTests/build

RUN mkdir -p build
WORKDIR /usr/src/myproject/tests/fileCreationTests/build

RUN cmake .. && make

CMD ["./runFileCreationTests"]