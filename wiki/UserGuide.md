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
    ![dir](image.png)
    3. Start the Expo development server using the command npx expo start --tunnel -c:
    ![command](image-1.png)
    right afterwards tiy ganna see a QR code- scan it and the mobile application will launch automatically
    ![total](image-2.png)

Now I gonna explain about the 2 versions-

    WEB-

    Open a browser and go to: http://localhost:5173
    there you will be met with this page
    ![landing page](images/WEB/3.png)  

    we will choose to sign up  
    ![signup-username](images/WEB/21.png)  
    ![signup-email](images/WEB/4.png)  
    ![signup-password](images/WEB/5.png)
    ![signup-image](images/WEB/6.png)

    after that we are redirected to the main page
    ![main page](images/WEB/18.png)

    there we can add folders or files
    ![create folder](images/WEB/7.png)
    ![create folder](images/WEB/8.png)

    we can go inside and create subfolders or add new files
    ![create file](images/WEB/11.png)
    ![file created](images/WEB/12.png)

    and if we have the right permission we can open the file and even change its content
    ![open file](images/WEB/13.png)

    ![folder in main page](images/WEB/8.png)

    we can click the 3 dots on the right to open all the actions we can preform on this specific entry  
    ![file action menu](images/WEB/9.png)

    we can share it to our friends  
    ![share menu](images/WEB/10.png)

    we can delete it and it will move to the trash page along with its content
    ![trash page](images/WEB/14.png)

    we can star it and unstar it
    ![trash page](images/WEB/16.png)
    ![trash page](images/WEB/15.png)

    the top ten recently opened files or folders will appear on the recents page
    ![recents page](images/WEB/17.png)

    we can enter another users email and give him viewer or editor permissions
    ![add permission](images/WEB/19.png)

    and when he logs in he can see the shared file in his shared with me page
    ![shared with me page](images/WEB/20.png)

    MOBILE-
    After scanning the QR code you will be met with this page-
    ![email](images/Mobile/image-4.png)

    we will choose to create a user becasue we don't have account=
    ![username](images/Mobile/image-5.png)
    ![email](images/Mobile/image-3.png)
    ![password](images/Mobile/image-6.png)
    ![pic](images/Mobile/image-7.png)
    ![pic-selected](images/Mobile/image-8.png)

    after that we are redirected to the main tab-
    ![main](images/Mobile/image-9.png)

    we can choose to switch between light and dark-mode:
    ![menu](images/Mobile/image-10.png)
    ![light](images/Mobile/image-11.png)

    we can add folders or files:
    ![add](images/Mobile/image-12.png)
    ![folder](images/Mobile/image-13.png)
    ![proof](images/Mobile/image-14.png)
    ![file-proof](images/Mobile/image-15.png)

    pressing the three-dots gives us an action menu:
    ![action-menu](images/Mobile/image-16.png)

    we can choose to either edit, share, move to trash, star, move and rename
    ![edit](images/Mobile/image-17.png)

    share:
    ![share](images/Mobile/image-18.png)

    After sharing the user get login and see the shared file-
    ![shared-file](images/Mobile/image-25.png)

    trash:
    ![trash](images/Mobile/image-19.png)
    ![trash-page](images/Mobile/image-24.png)

    star:
    ![star](images/Mobile/image-20.png)
    ![unstar](images/Mobile/image-21.png)

    rename:
    ![rename](images/Mobile/image-22.png)
    ![rename-proof](images/Mobile/image-23.png)
