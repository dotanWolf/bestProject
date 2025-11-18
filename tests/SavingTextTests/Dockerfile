# in order to build this dockerfile go to the root directory (bestProject)
# then run: docker build -f tests/SavingTextTests/Dockerfile -t saving-tests .

# then run it using: docker run saving-tests

FROM gcc:latest

RUN apt-get update && apt-get install -y cmake

# Copy the ENTIRE project into the container
COPY ../.. /usr/src/myproject

# Move into the test folder
WORKDIR /usr/src/myproject/tests/SavingTextTests/build

# Configure + build
RUN mkdir -p build
WORKDIR /usr/src/myproject/tests/SavingTextTests/build
RUN cmake .. && make

CMD ["./runSavingTextTests"]