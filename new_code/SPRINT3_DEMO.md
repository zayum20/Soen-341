# Sprint 3 demo: submitted resumes and seeker analytics

CareerConnect keeps using the accounts you create in the website. This demo
does not add a shared password. Register fictional accounts locally, apply
migration `002`, then follow the steps below.

## Before the demo

1. From `new_code`, install dependencies and start MySQL:

```sh
npm ci
npm start
```

2. If this database was created before the submitted-resume columns existed,
   apply the migration once. From the repository root:

```sh
mysql -u root -p
```

```sql
SOURCE new_code/migrations/002_link_submitted_application_resumes.sql;
```

A new database created from the updated `database.sql` already has the columns.
Do not rerun `database.sql` if the database has records you need.

If `applications.job_id` still references an older `job_postings` table, leave that foreign key alone. The current server reads and writes `jobs`, and existing applications may still point at `job_postings`. Confirm a newly posted job is stored in `jobs` and that a new application is allowed to reference it before the demo. Do not drop `job_postings` until the team agrees those older rows can be moved or retired.

3. Open http://localhost:3000 and create two fictional accounts:
   - a job seeker
   - an employer

4. Log in as the employer and post at least one job.
5. Log out, then log in as the job seeker. On My Profile, upload a PDF as Resume A.

## Demo script

1. Log in as the job seeker.
2. Open the posted job and apply with Resume A. The confirmation names the submitted resume.
3. Open My Applications, then View details. Download the resume and confirm it is Resume A.
4. Return to My Profile and replace the profile resume with Resume B.
5. Reopen the earlier application. Its download is still Resume A. The profile page shows Resume B.
6. Open My Applications. It lists the job title, company, recruiter name when the employer profile has one, submission date, and status.
7. Open the application details page for the current status.
8. Log out and log in as the employer. On Applicants, change that application's status and save it.
9. Log back in as the job seeker, refresh the dashboard, and confirm the status card and application now show the recruiter's status.
10. The dashboard shows total applications, counts for Applied, Under Review, Interview, Offered, and Rejected, and submissions for the current Monday–Sunday UTC week plus the previous seven weeks.

## Optional sample applications

The seed script adds four applications spread across that eight-week window.
It only attaches them to accounts that already exist, and it does not store a resume on those sample rows. Create the accounts first, then run this from `new_code`:

```sh
DEMO_SEEKER_EMAIL="seeker@example.com" DEMO_EMPLOYER_EMAIL="employer@example.com" node --env-file-if-exists=.env scripts/seed-sprint3-demo.js
```

Replace the emails with the fictional accounts you registered. The script reads the database password from the private `.env` file.

## Status names

The application status values are Applied, Under Review, Interview, Offered, and Rejected. A newly submitted application starts as Applied. There is no separate Pending status.
