https://github.com/dotanWolf/bestProject.git

about the project- This project is a fullStack Web + Mobile application developed using React, Bootstrap, and Node.js, designed to replicate the core functionality and user interface of Google Drive. The application features a dynamic React frontend that communicates with a RESTful server to manage real time data, including user authentication via JWT, file and folder organization, search functionality, and a toggleable dark/light theme.

instruction to run the app:

In order to run the app you need to open two terminals-
    The first one-
    use the following commands in the terminal:
    go to the root directory (bestProject)
    then run: docker-compose up --build
    This terminal is required to run the backend, database, and infrastructure.

    The second one-
    This terminal is required only if you want to test the Mobile version-
    Steps:
    1.IP CHANGE
    PICTURE
    2. Navigate to the Native directory:
    PICTURE
    3. Start the Expo development server using the command npx expo start --tunnel -c:
    PICTURE
    right afterwards tiy ganna see a QR code- scan it and the mobile application will launch automatically
    PICTURE

Now I gonna explain about the 2 versions-

    WEB-
    Open a browser and go to: http://localhost:5173
    there you will be met with this page
    ![landing page](images/3.png)  
     we will choose to sign up  
     ![signup-username](images/21.png)  
     ![signup-email](images/4.png)  
     ![signup-password](images/5.png)
    ![signup-image](images/6.png)
    after that we are redirected to the main page
    ![main page](images/18.png)
    there we can add folders or files
    ![create folder](images/7.png)
    ![create folder](images/8.png)
    
    we can go inside and create subfolders or add new files
    ![create file](images/11.png)
    ![file created](images/12.png)
    and if we have the right permission we can open the file and even change its content
    ![open file](images/13.png)
    
    ![folder in main page](images/8.png)
    we can click the 3 dots on the right to open all the actions we can preform on this specific entry  
    ![file action menu](images/9.png)
    we can share it to our friends  
    ![share menu](images/10.png)
    we can delete it and it will move to the trash page along with its content
    ![trash page](images/14.png)
    we can star it and unstar it
    ![trash page](images/16.png)
    ![trash page](images/15.png)
    the top ten recently opened files or folders will appear on the recents page
    ![recents page](images/17.png)
    
    we can enter another users email and give him viewer or editor permissions
    ![add permission](images/19.png)
    and when he logs in he can see the shared file in his shared with me page
    ![shared with me page](images/20.png)

    MOBILE-
    After scanning the QR code you will be met with this page-
    