# SOEN 341 Project

## Project Description
The goal of this project is to create a web-based platform for job searching, similar to LinkedIn and Indeed. It will be called CareerConnect, and it is meant to centralize job search activities for both recruiters and job seekers. This platform should ease the job search process for job seekers by allowing them to manage their search activities, and thus stay organized throughout their career development journey. All users should be able to create profiles, upload and manage their resumes, search for job opportunities, and track application statuses and their progression. As for recruiters, the system should allow them to post and manage job postings. The team will be undertaking this project using Agile practices and GitHub-based collaboration. The development process will be divided into four sprints over four months.

## Identified Problem
Most online job boards were made to solve the issue of job posting visibility and distribution. However, they still do not allow users to manage and track their applications, which would be much more convenient for job seekers since it would allow them to centralize all of their job activities in a single space. 

## Proposed Solution
Our team proposes to build a web-based platform that aims to centralize the entire job search process, from searching and saving job postings, tailoring resumes to job postings, applying to said postings, and tracking application status for job seekers, to posting and managing job postings for recruiters. 

## Team Members
Sara Azmoon - saraazzz. 

Tasneem Sultana Chowdhury - TasneemChowdhury. 

Aminata Mbengue - mina. 

Angelina Yajaira Montano - aymontano1. 

Ariane Madjofo Sofouet - Mesa237. 

Ayza Waris - zayum20. 



## Technologies
Front-end:
HTML, CSS, JavaScript

Backend:
Node.js, express.js(?)

Database:
MySQL


## Setup Instructions

1. Define project structure

<img width="341" height="421" alt="Screenshot 2026-09-27 at 10 49 51 PM" src="https://github.com/user-attachments/assets/0710bef1-d8bb-4327-8da2-8a6f9d6d96ba" />

2. Check that Node.js and npm are installed

  In the project terminal, input:
  node -v. 
  npm -v. 
  
  If they are installed, the terminal will display your node and npm version number.

3. Initialize the Node.js project

  In the project terminal, input:
  npm init -y
  
  This will create a “package.json” file.

4. Install Express.js

  In the project terminal, input:
  npm install express
  
  Then, once MySQL is installed, input:
  npm install mysql2 bcrypt

5. Install MySQL

  In the project terminal, input:
  brew install MySQL
  
  Then, to start MySQL, input:
  brew services start MySQL
  
  To check that mySQL is running, input:
  brew services list
  
  If it is successfully installed, you should see mySQL running.

6. Open MySQL

  In the project terminal, input:
  MySQL -u root (There is no password as it is installed locally)

7. Create the Database

  In the project terminal, input:
  CREATE DATABASE recruiting_website
  USE recruiting_website

8. Create the user table

  In the project terminal, input:
	SHOW TABLES
	DESCRIBE users
	
  This will allow you to check and inspect the database.

9. Connect Node.js to MySQL

  In the project terminal, input:
	host: localhost
	user: root
	password: “”
	database: recruiting_website

10. Start the server

  In the main project terminal, input:
  node server/server.js
  
  After inputting, you should see the following in the terminal:
  Connected to MySQL database!
  Server running at http://localhost:3000 
  Open the link http://localhost:3000 

## Proposed Features
- User registration, authentication, and profile management
- Resume upload and management
- Job posting management for recruiters
- Job search and filtering
- Job application submission done from the website
- Application status tracking (Applied, Interview, Offered, Rejected)
- Application history dashboard
- Notifications and reminders for application deadlines
- Saved jobs and favorites

AI-based features:
- AI-assisted resume feedback (suggestion)
- Job matching suggestions (suggestion)

