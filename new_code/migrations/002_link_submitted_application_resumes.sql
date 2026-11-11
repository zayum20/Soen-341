-- CareerConnect: keep a private copy of the resume submitted with each application.
-- Requires MySQL 8.0+ and the existing applications table from database.sql
-- or migration 001. Back up important local data first.
-- From the repository root, open MySQL, then run:
-- SOURCE new_code/migrations/002_link_submitted_application_resumes.sql;
--
-- Existing applications stay in place. Both new columns are nullable, so an
-- application created before a resume was saved remains valid.
-- No sample data is inserted. No tables or records are dropped.

USE recruiting_website;

SET @careerconnect_resume_file_exists = (
    SELECT COUNT(*)
    FROM information_schema.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = 'applications'
      AND COLUMN_NAME = 'submitted_resume_file'
);

SET @careerconnect_resume_file_sql = IF(
    @careerconnect_resume_file_exists = 0,
    'ALTER TABLE `applications` ADD COLUMN `submitted_resume_file` VARCHAR(255) DEFAULT NULL',
    'SELECT ''submitted_resume_file already exists; left unchanged'' AS migration_note'
);
PREPARE careerconnect_resume_file_statement FROM @careerconnect_resume_file_sql;
EXECUTE careerconnect_resume_file_statement;
DEALLOCATE PREPARE careerconnect_resume_file_statement;

SET @careerconnect_resume_name_exists = (
    SELECT COUNT(*)
    FROM information_schema.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = 'applications'
      AND COLUMN_NAME = 'submitted_resume_original_name'
);

SET @careerconnect_resume_name_sql = IF(
    @careerconnect_resume_name_exists = 0,
    'ALTER TABLE `applications` ADD COLUMN `submitted_resume_original_name` VARCHAR(255) DEFAULT NULL',
    'SELECT ''submitted_resume_original_name already exists; left unchanged'' AS migration_note'
);
PREPARE careerconnect_resume_name_statement FROM @careerconnect_resume_name_sql;
EXECUTE careerconnect_resume_name_statement;
DEALLOCATE PREPARE careerconnect_resume_name_statement;

-- The stored file name is only a private file key. It is not a public URL.
SHOW COLUMNS FROM applications LIKE 'submitted_resume%';
