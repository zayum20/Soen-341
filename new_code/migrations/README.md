# Database migrations

There are no migrations yet. The current `database.sql` is the starting schema.
Each teammate maintains their own local database; GitHub shares schema changes,
not live records or credentials.

## Adding a change

1. Coordinate the next number with the team, then create a file such as
   `001_add_job_salary.sql`. Use consecutive three-digit numbers.
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
SOURCE new_code/migrations/001_add_job_salary.sql;
```

Replace the example filename with an actual migration. Run each file once on
each database. Keep a private checklist of successfully applied filenames;
there is no automatic migration runner or history table in this setup.
If any statement fails, stop and inspect the database before retrying. MySQL
schema changes can remain applied even when a later statement fails.

Never use `database.sql` to update a database containing records you need.
For now, keep it as the starting schema; new installations import it once and
then apply all numbered migrations. Keep optional fictional sample data in a
separate seed script, not mixed with schema migrations.
