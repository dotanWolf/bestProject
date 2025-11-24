# bestProject
https://github.com/dotanWolf/bestProject.git

instruction to run the code:
use the following commands in the terminal:
for running tests:
go to the root directory (bestProject)
docker-compose up --build
![compose build](image-1.png)
![compose result](image-2.png)
for running the app- 
go to the root directory (bestProject)
then run: docker build -t app .
then run it using: docker run -it -v files:/app/data app
![app build](image-3.png)
![app run](image-4.png)

about the app-
This application is a Command Line Interface (CLI) tool that allows users to add, get and serach files the files saved in comprossed way using RLE compression.

Example of the code running-
![Example of the code running-1](image.png)
![Example of the code running-2](image-5.png)