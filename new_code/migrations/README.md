# Database migrations

`database.sql` is the starting schema. The migration
`001_add_applications_and_resume_path.sql` updates older local databases
that are missing the applications table or the resume_path column.
`002_link_submitted_application_resumes.sql` adds nullable columns that
store the private file name of the resume submitted with an application.
Each teammate maintains their own local database; GitHub shares schema changes,
not live records or credentials.

## Adding a change

1. Coordinate the next number with the team, then create a file such as
   `002_add_job_salary.sql`. Use consecutive three-digit numbers.
2. Begin with `USE recruiting_website;`, then write the required `ALTER TABLE`
   or `CREATE TABLE` statements. Preserve existing data.
3. Include the migration in the same pull request as the code that uses it.
   Describe the expected before/after schema and how you verified existing
   records still work. Test on a disposable local database first.
4. Once merged, keep the migration unchanged. Make corrections in a new file.

The salary filename is an example only; no salary change is required or included.

## Applying changes

From the repository root, open MySQL using your local credentials:

```sh
mysql -u root -p
```

On a Mac using the official installer, use
`/usr/local/mysql/bin/mysql -u root -p` if `mysql` is not on your PATH.

At the `mysql>` prompt, apply pending numbered SQL files in ascending order:

```sql
SOURCE new_code/migrations/001_add_applications_and_resume_path.sql;
SOURCE new_code/migrations/002_link_submitted_application_resumes.sql;
```

Run each pending file once, in order, on each database. `001` adds the applications table and
profile `resume_path` column. `002` adds the submitted-resume columns. Keep a private checklist of successfully applied filenames;
there is no automatic migration runner or history table in this setup.
If any statement fails, stop and inspect the database before retrying. MySQL
schema changes can remain applied even when a later statement fails.

Never use `database.sql` to update a database containing records you need.
For now, keep it as the starting schema; new installations import it once and
then apply all numbered migrations. Keep optional fictional sample data in a
separate seed script, not mixed with schema migrations.

## Posting archiving (003)

Apply `003_archive_job_postings.sql` once before running the archive-enabled server.
It adds a nullable `jobs.archived_at` timestamp and preserves existing jobs and applications.
Do not rerun the starting schema on an existing database.

```sql
SOURCE new_code/migrations/003_archive_job_postings.sql;
```

Archived postings remain in the employer list and existing application views. Seeker
search excludes them, and the application endpoint rejects new submissions. Direct
job details report `status: archived` so a saved link can explain availability.

## Optional deadlines (004)

`004_optional_posting_deadlines.sql` adds nullable `jobs.deadline_at` and its index.
Apply once after 003, before starting the deadline-enabled server. Existing rows
get NULL (no deadline). This migration has not been applied by the authoring step.

The API accepts `application_deadline` as YYYY-MM-DD, blank, or null. Dates close
at the start of the next day in America/Toronto, converted to a UTC instant.
Create defaults to no deadline; edit omission preserves the deadline and explicit
blank/null removes it. Expired jobs reject applications and are excluded from search
even before an archive worker runs. API deadline_at values are ISO UTC strings.
Notification code can use that timestamp without guessing the timezone.

The running server archives expired postings at startup and every 60 seconds.
Search and application inserts enforce the UTC deadline immediately, independently
of the worker. Archived postings are not reopened by changing or removing a deadline.
The worker retains original archive dates and all existing applications.
