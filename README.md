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

Use the [local database setup guide](new_code/DATABASE_SETUP.md) to install
existing dependencies, configure your private `.env`, and start CareerConnect.
Each teammate runs their own local MySQL database; GitHub shares the schema.

For future table changes, follow the
[migration workflow](new_code/migrations/README.md).
Do not rerun `database.sql` on an existing database: it deletes project data.

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

## Project Directory Tree

## Project Structure
```text
CareerConnect/
│
├── AI_Log/                           # Team AI usage records per sprint
│   ├── Angelina/
│   ├── Ayza/
│   ├── Elfy/
│   ├── Minatta/
│   ├── Sara/
│   └── Tasneem/
│
├── new_code/                         # Main application source code
│   │
│   ├── public/                       # Frontend client-side files
│   │   ├── index.html                # Welcome / landing page
│   │   ├── login.html & login.js     # User authentication
│   │   ├── register.html             # Role selection (Seeker vs Employer)
│   │   │
│   │   │── [ Job Seeker Pages ]
│   │   ├── Dashboard.html & .js      # Applications overview & status counts
│   │   ├── jobs.html & jobs.js       # Browse & filter open roles
│   │   ├── job.html & job.js         # Job details & application form
│   │   ├── my-applications.html      # Application tracker
│   │   ├── Profile.html              # Seeker profile & resume
│   │   │
│   │   │── [ Employer Pages ]
│   │   ├── Employer_Dashboard.html   # Employer overview
│   │   ├── employer-post-job.html    # Create job postings
│   │   ├── employer-applicants.html  # Review candidate submissions
│   │   ├── Employer_Profile.html     # Company profile
│   │   │
│   │   └── [ Stylesheets ]
│   │       ├── nav-bar.css           # Navigation & header layout
│   │       ├── job.css               # Ashby two-column layout
│   │       ├── jobs-filter.css       # Dynamic search & filter chips
│   │       └── style.css             # Global base styling
│   │
│   ├── server/                       # Backend Node.js / Express application
│   │   ├── server.js                 # API endpoints & authentication sessions
│   │   ├── db.js                     # MySQL connection setup
│   │   └── routes/                   # Modular API route controllers
│   │
│   ├── database.sql                  # MySQL database schema & tables
│   ├── package.json                  # Node dependencies (express, mysql2, bcrypt)
│   └── DATABASE_SETUP.md             # Local environment instructions
│
├── README.md                         # Project overview and setup guide
├── Sprint planning.md                # Sprint backlog and deliverables
└── Team Process.md                   # Agile team conventions
```
