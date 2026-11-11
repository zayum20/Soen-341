# Sara Azmoon — Sprint 2 Individual Contribution Log

**Project:** CareerConnect — Job Search and Application Tracking Platform  
**Course:** SOEN 341 — Software Process  
**Total Estimated Time Spent:** 38.5

## Contribution Overview

During Sprint 2, my contributions focused on implementing and integrating the recruiter and job-seeker dashboards, improving the job application workflow, fixing navigation and authentication-related issues, testing the application, troubleshooting the local development environment, and maintaining project documentation.

I collaborated with teammates on shared features and used ChatGPT/Codex as development aids. I reviewed the proposed changes and manually tested application functionality during development.

## Detailed Contribution Log

| # | Contribution | Date | Time Spent | Description | Related Evidence |
|---|---|---|---|---|---|
| 1 | Recruiter Dashboard Development | October 18–22 | 8h | Collaborated with Angelina on recruiter posting and dashboard functionality. Developed dashboard components to display the recruiter's total job postings, applications received, and recent recruitment activity. Added loading, empty, error, and retry states to improve reliability. The team selected my implementation for integration. | PR #65, PR #75 |
| 2 | Job-Seeker Dashboard Implementation | October 20–22 | 7h | Implemented a dedicated dashboard for job seekers to resolve the previously missing `Dashboard.html` page. Added application totals, application counts grouped by status, and recent application activity. Connected the interface to the existing application endpoints and addressed navigation between jobs, profiles, and application tracking. | PR #75 |
| 3 | Job Application Workflow Improvements | October 20–22 | 4h | Improved the existing application submission and tracking workflow. Added or refined application status filters, duplicate-submission safeguards, and user feedback after actions. Worked on ensuring that job seekers could follow their applications while recruiters could manage application statuses. | PR #75 |
| 4 | Navigation and Authentication Fixes | October 18–22 | 2h | Investigated broken dashboard links and corrected navigation paths between recruiter pages. Fixed the employer dashboard navigation link, added access to Post a Job and Applicants, corrected the logo path, and reviewed routing behavior for job seekers and employers. Helped separate the navigation flows for the two account roles. | PR #65, PR #75 |
| 5 | Public Homepage and Job Search Improvements | October 19–20 | 2h | Updated the public CareerConnect homepage with a welcome section, improved page structure, and refined the login and registration navigation. Adjusted styling while preserving the existing job-search form and API integration. Verified that the homepage continued displaying job postings after the changes. | Relevant frontend changes |
| 6 | Local Development Setup and MySQL Debugging | October 19–20 | 5h | Troubleshot Node.js, Express, MySQL connectivity, and local authentication problems. Updated local database connection settings to use environment variables instead of hardcoded credentials. Investigated server errors using terminal logs and Chrome DevTools, identifying missing database structures such as the `applications` table and `resume_path` column. Coordinated these findings with the teammate responsible for the database. | Local testing / AI Log |
| 7 | Application Testing and Integration Verification | Throughout Sprint 2 | 3h | Manually tested the CareerConnect user flows, including recruiter job posting, job listings, dashboard statistics, application submission, duplicate prevention, application statuses, navigation, and logout. Reviewed how frontend pages interacted with backend endpoints and investigated issues discovered during integration. | PR #75 / Testing evidence |
| 8 | Database Integration Support | October 20–22 | 3h | Reviewed the database requirements used by the application's backend and collaborated on integrating updated database structures. Investigated errors involving missing tables and columns, helped clarify the distinction between shared and local databases, and supported testing following database updates. The official database schema remained the responsibility of the assigned teammate. | Database-related documentation / AI Log |
| 9 | Sprint 2 Meeting Documentation | October 8, 16, 19 and 22 | 2h | Compiled and organized team meeting records. Documented attendance, progress updates, assigned responsibilities, deadlines, project decisions, and follow-up actions. Included relevant GitHub issue references where applicable to maintain traceability between meetings and project tasks. | Meeting minutes |
| 10 | User Story and Acceptance Criteria Review | Throughout Sprint 2 | 0.5 | Reviewed the Sprint 2 feature requirements and helped identify inconsistencies in user stories and acceptance criteria. Clarified application status terminology and the differences between the recruiter and job-seeker dashboards. Compared proposed functionality against project expectations. | GitHub Issues / Documentation |
| 11 | Demonstration Preparation and AI Documentation | October 20–26 | 2 | Prepared feature walkthroughs and documented AI-assisted development activities. Recorded how ChatGPT/Codex supported implementation, debugging, testing, and technical decision-making. Reviewed AI-generated suggestions and documented validation steps, modifications, and outcomes for the course AI usage log. | AI_Log / Demo documentation |

**Total Time:** 38.5

## Implementation Evidence

- **PR #65 — Recruiter Dashboard Navigation:** Navigation corrections and improvements to recruiter-related pages.
- **PR #75 — Dashboards and Application Flow Improvements:** Dashboard functionality, application management, and integration improvements.
- **Additional evidence:** Sprint 2 meeting minutes, GitHub Issues, local testing records, and AI usage documentation.

## Challenges and Resolutions

**Database integration:** Some backend requests initially failed because the local MySQL database did not contain all the tables and columns expected by the application. I investigated the errors using terminal output and reviewed the affected API endpoints. The findings were communicated for database integration.

**Dashboard navigation:** Several pages linked to a dashboard file that did not exist. I helped identify the affected links and worked on establishing separate dashboard functionality for recruiters and job seekers.

**Feature integration:** Multiple team members were developing related functionality. I reviewed existing implementations, avoided unnecessary duplication, and contributed to integrating dashboard and application features into the shared project.

## Summary

My Sprint 2 contributions covered both feature development and application integration. I worked on the recruiter dashboard, implemented job-seeker dashboard functionality, improved the application workflow, fixed navigation issues, and supported testing and troubleshooting across the frontend and backend.

In addition to coding, I contributed to meeting documentation, user-story review, demo preparation, and AI usage documentation. These activities helped connect the team's individual contributions into a more consistent CareerConnect application.

I used AI tools to assist with technical explanations, debugging, implementation suggestions, and documentation, while reviewing the changes and testing the main application flows myself.
