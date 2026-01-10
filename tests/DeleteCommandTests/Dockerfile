# in order to build this dockerfile go to the root directory (bestProject)
# then run: docker build -f tests/DeleteCommandTests/Dockerfile -t deletecommand-tests .

# then run it using: docker run deletecommand-tests

FROM gcc:latest

RUN apt-get update && apt-get install -y cmake

# Copy the ENTIRE project into the container
COPY . /usr/src/myproject
ENV RLE_DIR=/app/data

# Move into the test folder
WORKDIR /usr/src/myproject/tests/DeleteCommandTests/build

# Configure + build
RUN mkdir -p build
WORKDIR /usr/src/myproject/tests/DeleteCommandTests/build
RUN cmake .. && make

CMD ["./rundeleteCommandTests"]