
# CS-UY 3083 Air Ticket Web System
---
### Project Description
This project is made for CS-UY 3083 (Intro to database)
The project implemented a full-stack web system used for air ticket reservation, with features including:
1. Customer:
	- Register and Login into the System
	- Search for future flights based on source city/airport, destination city/airport, departure date and return date
	- Check for flights' status
	- Register air tickets
	- Unregister air tickets
	- Comments on previous flights
	- Track spendings and display with beautiful charts based on date range specified
2. Airline Staff
	- Search all flights (future/past) belong to the airline based on source city/airport, destination city/airport, departure date and return date.
	- Add a new flight
	- Update flight status
	- Add new airplane
	- Add new airport
	- View all comments of a flight
	- View all flights belong to the airline of a customer
	- View customer who registered for the airline most frequently
	- View ticket reports, displayed with beautiful charts
	- View earned revenue in the past month and year
### Project Showcase
![customer login](https://github.com/qianxichen233/CS-UY-3083-project/blob/main/main/part3/screenshots/customer-login.png?raw=true)
![customer purchase ticket](https://github.com/qianxichen233/CS-UY-3083-project/blob/main/main/part3/screenshots/customer-purchase.png?raw=true)
![customer check my flights](https://github.com/qianxichen233/CS-UY-3083-project/blob/main/main/part3/screenshots/customer-myflight.png?raw=true)
![staff change flight status](https://github.com/qianxichen233/CS-UY-3083-project/blob/main/main/part3/screenshots/staff-changestatus.png?raw=true)
![staff's panel](https://github.com/qianxichen233/CS-UY-3083-project/blob/main/main/part3/screenshots/staff-panel.png?raw=true)
![staff ticket report](https://github.com/qianxichen233/CS-UY-3083-project/blob/main/main/part3/screenshots/staff-report.png?raw=true)
### Tech Stack
1. Frontend: Reactjs
2. Backend: Flask
3. Database: Mysql
4. User authentication: JWT
### Setup
1. Server Side (in server folder)
	- Make sure mysql server is opened at port 3306
	- run `mv .env.example .env` and replace your mysql credentials
	- run `pip3 install -r requirements.txt` to install all dependencies
	- run `python3 database_reset.py` to initialize the database
	- run `python3 server.py` to start the server
2. Client Side (in client folder)
	- run `yarn install` to install add dependencies
	- run `yarn start` to start development server
### Contributions
1. Qianxi Chen (qc815@nyu.edu)
	- Responsible for frontend development
	- Set up backend and developed part of apis
2. Xiaoyi Yan (xy2089@nyu.edu)
	- Responsible for developing part of apis
	- Test and write reports for the app
### Special Thanks
1. Frontend UI inspiration: https://www.figma.com/community/file/1117770210185058199
