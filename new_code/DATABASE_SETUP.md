# Local database setup

Each teammate runs Express and MySQL locally. Everyone shares the same schema
through GitHub, while accounts, jobs, applications, and uploaded files stay local.
No hosting account is required.

## First setup on each laptop

Install Node.js 22 or later and MySQL 8.0 or later, and start MySQL.
Use MySQL rather than MariaDB because the schema uses a MySQL-specific collation.
From the repository root, connect:

```sh
mysql -u root -p
```

For the official Mac installer, if that command is unavailable:

```sh
/usr/local/mysql/bin/mysql -u root -p
```

At the `mysql>` prompt:

```sql
SHOW DATABASES;
```

Only on a fresh database, or when deliberately discarding all existing project
data, run:

```sql
SOURCE new_code/database.sql;
USE recruiting_website;
SHOW TABLES;
```

Expect six tables: `users`, `employer_profiles`, `job_seeker_profiles`,
`job_seeker_skills`, `jobs`, and `applications`.
Apply any numbered migrations as described in [migrations/README.md](migrations/README.md),
then exit MySQL with `exit;`.

In the terminal:

```sh
cd new_code
npm ci
cp .env.example .env
```

Copy the template only if you do not already have a `.env`; copying overwrites it.
On Windows, copy the file using your editor or file manager instead.
Edit `.env` privately with your own MySQL username and password, then run:

```sh
npm start
```

Open http://localhost:3000. Check for `Connected to MySQL database!` in the terminal.
Create fictional employer and job seeker accounts through the website, post a job,
and submit an application to verify the complete flow.

## Working together

- Commit `.env.example`, SQL files, application code, and setup documentation.
- Never commit `.env`, database data directories, real resumes, or private dumps.
- After pulling changes, read and apply pending migrations once, in order.
- Coordinate migration numbers in the pull request. Review and merge database
  changes with the feature that needs them.
- Do not rerun `database.sql` on an existing database: it drops all project tables.
- `add_jobs_and_applications.sql` is an optional legacy helper that also inserts
  sample jobs; it is not required for this fresh setup. It requires an employer
  account to insert its samples.

See [the migration workflow](migrations/README.md) before changing table structure.
