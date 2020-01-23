# Alumini-Tracking-System
> An Alumini Tracking System

Alumini Tracking System ( Currently there is no mechanism for colleges to keep a track of students passed out.
Hence the problem is to develop a web based application for colleges to keep a track of Alumini)
## Technologies Used

Frontend : HTML, CSS, JAVASCRIPT, Bootstrap, ParticlesJS.

Backend  : NodeJS

Database : MongoDB

API's    :  HERE, Twilio, nodemailer , Google maps API.



## Installing / Getting started

A quick introduction of the minimal setup you need to set up the app &
running.

Make sure Nodejs is installed.After successfully installing Nodejs,run the following commands in the terminal.

```shell
npm install --save  #installs all the dependencies used in the project
node app.js       #starts the app server
```

The first command initializes the project with a package.json file and installs all the dependencies used in the project which are listed down in package.json file.
The second command starts the app server and you can access the web app by visiting http://localhost:3000/ on your laptop/pc.
Note:- If you change the port number in config.js file , then remember to change the port number while visiting the above URL too.

### Initial Configuration

Open the config.js file located in the config folder.

In the config.js file,
* User must configure the Twilio credentials by entering the authToken and accounSid information.
* User must configure the mLab credentials by entering the nodemailer username and password.
* User can also change the port number, if required.

In the app.js file,
* User must enter the email id and password in order to allow nodemailer to send emails using the provided email id.
Note:- The Allow less secured apps must be checked in Gmail so as to send mails smoothly.

P.S: Twilio API has been used for sending out SMS and Nodejs nodemailer has been used for sending out emails.

## Features

1.	Allow alumini members to register themselves.

2.	Allow colleges to verify & authenticate their registered alumini.

3.	Provision for alumini members to update their details.

4.	Allow colleges to search details based on criteria such as year, subject, etc.

5.	Send messages and emails to alumini members.

6.	Group chats, create events, publish notices on the portal.

7.	Security features with login for every user.

## Links

- Repository:  https://github.com/amankumarkeshu/Alumini-Tracking-System
