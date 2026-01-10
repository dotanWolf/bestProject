# in order to build this dockerfile go to the root directory (bestProject)
# then run: docker build -f tests/searchCommandTests/Dockerfile -t searchcommand-tests .

# then run it using: docker run searchcommand-tests

FROM gcc:latest

RUN apt-get update && apt-get install -y cmake

# Copy the ENTIRE project into the container
COPY . /usr/src/myproject
ENV RLE_DIR=/app/data
RUN mkdir -p $RLE_DIR

# Move into the test folder
WORKDIR /usr/src/myproject/tests/searchCommandTests/build

# Configure + build
RUN mkdir -p build
WORKDIR /usr/src/myproject/tests/searchCommandTests/build
RUN cmake .. && make

CMD ["./runsearchCommandTests"]