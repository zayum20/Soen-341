-- CareerConnect: update older local databases without deleting records.
-- Requires MySQL 8.0+ and the existing users, jobs, and job_seeker_profiles tables.
-- Back up important local data first. Run with an account permitted to CREATE/ALTER.
-- From the repository root, open MySQL, then run:
-- SOURCE new_code/migrations/001_add_applications_and_resume_path.sql;
--
-- Already-present objects are left unchanged; this script does not repair
-- existing definitions that differ from database.sql. Check the results below.
-- No sample data is inserted. No tables or records are dropped.

USE recruiting_website;

-- MySQL does not support ADD COLUMN IF NOT EXISTS; inspect metadata instead.
SET @careerconnect_resume_exists = (
    SELECT COUNT(*)
    FROM information_schema.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = 'job_seeker_profiles'
      AND COLUMN_NAME = 'resume_path'
);

SET @careerconnect_resume_sql = IF(
    @careerconnect_resume_exists = 0,
    'ALTER TABLE `job_seeker_profiles` ADD COLUMN `resume_path` VARCHAR(255) DEFAULT NULL',
    'SELECT ''resume_path already exists; left unchanged'' AS migration_note'
);
PREPARE careerconnect_resume_statement FROM @careerconnect_resume_sql;
EXECUTE careerconnect_resume_statement;
DEALLOCATE PREPARE careerconnect_resume_statement;

-- Same definition as database.sql, with a guard for teammates who added it already.
CREATE TABLE IF NOT EXISTS `applications` (
  `id` int NOT NULL AUTO_INCREMENT,
  `job_id` int NOT NULL,
  `job_seeker_id` int NOT NULL,
  `status` enum('Applied','Under Review','Interview','Offered','Rejected') NOT NULL DEFAULT 'Applied',
  `cover_note` text,
  `applied_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_application` (`job_id`,`job_seeker_id`),
  KEY `job_seeker_id` (`job_seeker_id`),
  CONSTRAINT `applications_ibfk_1`
    FOREIGN KEY (`job_id`)
    REFERENCES `jobs` (`id`)
    ON DELETE CASCADE,
  CONSTRAINT `applications_ibfk_2`
    FOREIGN KEY (`job_seeker_id`)
    REFERENCES `users` (`id`)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Verify both definitions match database.sql, especially on previously updated DBs.
SHOW COLUMNS FROM job_seeker_profiles LIKE 'resume_path';
SHOW CREATE TABLE applications;
