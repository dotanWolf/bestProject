# bestProject
https://github.com/dotanWolf/bestProject.git

about the project-
This project is a Google Drive-style web server built with a Node.js MVC structure that connects to a C++ backend to save files permanently. We developed a RESTful API to serve as the main infrastructure, allowing future clients to easily register, log in, and manage their files.

instruction to run the code:  
use the following commands in the terminal:

for running the cpp server-  
go to the root directory (bestProject)  
then run: docker build -t best-project .  
![project build](image-1.png)

now for the cpp server-  
run: docker run --init --rm -it -p 9120:9120 -v files:/app/data best-project ./build/MyProject 9120  
![cpp server run](image-2.png)

For web server (in a new terminal)  
run: docker run --init --rm -it -p 8080:8080 best-project  
![web server run](image-3.png)

Now in a new terminal you can run any curl command  
![Example of running curl-1](image-4.png)
![Example of running curl-2](image-5.png)
![Example of running curl-3](image-6.png)
![Example of running curl-4](image-7.png)
![Example of running curl-5](image-8.png)
![Example of running curl-6](image-9.png)
![Example of running curl-7](image-10.png)
![Example of running curl-8](image-11.png)
![Example of running curl-9](image-12.png)




