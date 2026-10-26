# AI Usage Log — Chat #1

**Project:** CareerConnect — Job Search and Application Tracking Platform  
**Course:** SOEN 341 — Software Process  
**Sprint:** Sprint 2  
**Responsible Person:** Sara Azmoon  
**AI Tool Used:** ChatGPT (OpenAI)  
**Chat Link:** https://chatgpt.com/share/6adf846f-a454-83ea-8749-d5174ea5ec80 

### Task ID/Title
AI-01: Development Environment Setup, Database Troubleshooting, and Sprint 2 Planning

### Purpose of AI Use
AI was used for technical guidance, debugging, understanding unfamiliar development tools, and planning individual responsibilities for Sprint 2. The goal was to understand and run the existing Sprint 1 application locally before starting new development work.

### AI-Suggested Content
ChatGPT provided step-by-step guidance for:

- Understanding Node.js, npm, Express.js, MySQL, and their roles in the application.
- Installing project dependencies and configuring a local MySQL environment.
- Troubleshooting MySQL server initialization and connection errors.
- Importing the existing `database.sql` file and verifying database tables.
- Connecting the Node.js backend to MySQL using environment variables.
- Running the Sprint 1 application locally.
- Creating a separate Git branch for Sprint 2 development.
- Planning the division of frontend and backend responsibilities between Sara and Angelina, including job listing retrieval and recruiter job posting functionality.

### Validation
AI suggestions were verified through terminal outputs, manual inspection of the existing project files, and comparison with the team's Sprint 1 setup instructions.

The MySQL connection and database import were successfully verified. The Node.js server started, confirmed its connection to MySQL, and displayed the CareerConnect welcome page at `localhost:3000`.

Git commands were also verified by checking that the `sara-sprint2-job-listings` branch was created successfully.

The proposed Sprint 2 task distribution was reviewed against the project requirements. The suggested job-listing features and database structure were planning recommendations and were not implemented during this conversation.

### Decision
**Accepted with modifications.**

Most AI guidance was followed for the local environment setup and troubleshooting. Some commands were adjusted after encountering errors. The suggested Sprint 2 development plan was retained as a starting point, subject to coordination with teammates.

### Reflection
AI assistance was helpful in understanding the existing codebase and resolving technical setup issues. It provided explanations of unfamiliar tools and commands, making it easier to identify errors and understand the relationship between the frontend, backend, and database.

The interaction also helped organize the next development steps and clarify individual responsibilities. All commands were executed and checked manually, and AI suggestions were not treated as automatically correct.

### Outcome
- Local Node.js environment configured.
- Project dependencies installed.
- MySQL server initialized and running.
- Existing Sprint 1 database imported.
- Backend successfully connected to MySQL.
- CareerConnect Sprint 1 welcome page running locally.
- Separate Sprint 2 development branch created.
- Sprint 2 responsibilities and proposed implementation approach identified.

**AI Contribution:** Technical explanation, troubleshooting guidance, and development planning.

**Human Contribution:** Executing commands, reviewing outputs, configuring the local environment, verifying results, and making project decisions.

# AI Usage Log — Chat #2

**Course:** SOEN 341 – Software Process  
**Project:** CareerConnect – Job Search and Application Tracking Platform  
**Sprint:** Sprint 2  
**Responsible Person:** Sara  
**AI Tool:** ChatGPT (OpenAI)  
**Conversation Period:** October 18–20, 2026  
**Chat Link:** https://chatgpt.com/share/6adf883e-8ff0-83e9-9e73-2d734fd09295

## Task ID/Title
**AI-02: CareerConnect Frontend Development, Recruiter Dashboard Implementation, Debugging, and Database Integration Planning**

## Purpose of AI Use

ChatGPT was used for step-by-step assistance with implementing and testing CareerConnect features. The main objectives were to improve the public homepage, develop the recruiter dashboard, troubleshoot authentication and database issues, review backend endpoints, and organize the remaining development tasks.

AI was also used to explain JavaScript, HTML, CSS, MySQL, and GitHub workflows to support understanding of the implementation.

## AI-Suggested Content

**1. Recruiter Dashboard Development**

- Reviewed `Employer_Dashboard.js` and identified the existing profile verification, job submission, hamburger menu, and logout functionality.
- Suggested modifying the job submission event listener using optional chaining to prevent JavaScript errors when the duplicate posting form is removed.
- Assisted with adding dashboard sections for Jobs Posted and Applications Received.
- Generated JavaScript for retrieving the logged-in employer's job count through `/api/employer/jobs`.

**2. Public Homepage and Navigation**

- Suggested restructuring `index.html` to introduce CareerConnect with a welcome section.
- Provided HTML and CSS improvements for the homepage, including typography, spacing, and a purple gradient.
- Suggested improving the Log In and Create an Account navigation elements.
- Helped identify broken links pointing to the nonexistent `Dashboard.html` page.
- Recommended separate dashboards for job seekers and recruiters.

**3. Backend and MySQL Troubleshooting**

- Assisted with connecting the Express server to local MySQL using environment variables instead of hardcoding the database password.
- Explained how to restart Node.js and MySQL and investigate connection and authentication errors.
- Reviewed `server.js` and relevant API endpoints.
- Helped identify two local database problems: a missing `resume_path` column in `job_seeker_profiles` and a missing `applications` table.
- Explained why these problems prevented profile retrieval and application tracking.

**4. Database Integration and Team Coordination**

- Compared shared online database hosting with separate local MySQL databases.
- Recommended using a common SQL schema while allowing team members to develop with separate local databases.
- Assisted with drafting a message to the teammate responsible for database development.

**5. Development Workflow**

- Provided guidance for working with GitHub Desktop branches and protecting uncommitted changes.
- Explained how to use ChatGPT Work for local project inspection and development without automatically pushing changes to GitHub.

## Validation of AI Output

AI suggestions were reviewed through manual code inspection and local testing in VS Code and Chrome.

- **Homepage:** Verified that the new welcome section and navigation styling displayed correctly. Existing job listings remained visible.
- **Recruiter Dashboard:** Verified that the dashboard opened successfully and that the Jobs Posted counter displayed `1`, matching the existing employer job posting.
- **MySQL:** Confirmed a successful database connection through the backend.
- **Navigation:** Identified and corrected the employer applicants page's broken dashboard link.
- **Debugging:** Used browser Console errors and Node.js terminal output to identify missing database structures.

**Remaining limitations:** The Applications Received counter was not fully validated because the local `applications` table was missing. The job-seeker profile also encountered a missing-column error. The job-seeker dashboard had not yet been completed during this conversation.

## Decision

**Modified before use and partially accepted.**

Most AI-generated explanations and code suggestions were reviewed, applied incrementally, and tested manually.

Some UI suggestions were modified or rejected based on personal design preferences, including reverting a proposed logo background change.

Database recommendations were discussed with the team, but final database implementation remained the responsibility of the assigned teammate.

## Reflection

ChatGPT helped me understand the relationship between frontend components, backend API endpoints, user authentication, and the MySQL database. The step-by-step explanations were especially useful for identifying why certain dashboard features were not loading and for understanding how to debug errors using the browser Console and VS Code terminal.

The AI assistance reduced the time required to investigate unfamiliar technical problems and helped me organize the remaining development work. However, I learned that generated code still requires manual verification, and that an apparently correct frontend feature may depend on database structures that are not yet available.

Overall, AI was useful for implementation guidance, debugging, documentation, and improving my understanding of the application.
Validation evidence included local browser testing, server terminal messages, and screenshots shared during the conversation.
