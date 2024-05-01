# Configuring the project before running

## IQUIZ website

Backend is using Express and MongoDB. Frontend is using React.

### Backend configuration

1. Open the terminal and go to the root directory of the api folder.
2. Run the command "npm install" to install all the dependencies.
3. Change the .env file in the root directory of the api folder. If cannot access the mongodb atlas(normally using shool wifi will fail to access it), please change to local mongodb(in this case you must add >=8 questions to test the recommendations functions using other account).
4. Run the command "npm run dev" to start the server. Now the server is running on localhost:5001.
5. For the recommendation API, run the command "docker pull jatemerlin/test" and "docker run -p 5003:5003 jatemerlin/test" to start the recommendation algorithm server. Now the server is running on localhost:5003.

### Frontend configuration

1. Open the terminal and go to the root directory of the ui folder.
2. Run the command "npm install" to install all the dependencies.
3. Change the .env file in the root directory of the ui folder(Optional).
4. Run the command "npm run start" to start the server. Now the server is running on localhost:3000.

Now, you can explore the website on localhost:3000.

### As for login
You can use test1@1.com and 111111 to login. (Or Register by yourself if you use the local mongodb.)

### Presentation Video Link
https://www.youtube.com/watch?v=kh53rmm05e4

### Licence
This software is released under the MIT License.

Copyright (c) 2023 Jianwen Wei, Zichen Yang, and Xuan Ouyang
