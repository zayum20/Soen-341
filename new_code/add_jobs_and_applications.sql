-- Adds applications without dropping existing accounts.
-- Run this on the existing recruiting_website database.
-- Do not re-run database.sql on a database that already has users.
--
-- Sample jobs are attached to the first employer account.
-- Register an employer before running this file, or the seed inserts nothing.
-- The jobs table must already exist.

USE recruiting_website;

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

INSERT INTO jobs (employer_id, title, company, location, category, job_type, description)
SELECT
    employer.id,
    sample_jobs.title,
    COALESCE(employer.company_name, 'Company'),
    sample_jobs.location,
    sample_jobs.category,
    sample_jobs.job_type,
    sample_jobs.description
FROM (
    SELECT users.id, employer_profiles.company_name
    FROM users
    LEFT JOIN employer_profiles
        ON users.id = employer_profiles.user_id
    WHERE users.role = 'employer'
    ORDER BY users.id
    LIMIT 1
) AS employer
CROSS JOIN (
    SELECT
        'Software Engineering Intern' AS title,
        'Montreal, QC' AS location,
        'Engineering' AS category,
        'Internship' AS job_type,
        'Help build product features, fix bugs, and work with a small engineering team on a hiring platform.' AS description
    UNION ALL
    SELECT
        'Frontend Developer',
        'Toronto, ON',
        'Engineering',
        'Full-time',
        'Build responsive web pages and work with designers on the experience job seekers use to find roles.'
    UNION ALL
    SELECT
        'Data Analyst',
        'Remote',
        'Data',
        'Full-time',
        'Review hiring data, prepare reports, and help the team understand which roles attract applicants.'
    UNION ALL
    SELECT
        'Customer Support Specialist',
        'Laval, QC',
        'Support',
        'Part-time',
        'Answer questions from job seekers and employers and keep support requests organized.'
) AS sample_jobs
WHERE NOT EXISTS (
    SELECT 1
    FROM jobs
    WHERE jobs.employer_id = employer.id
      AND jobs.title = sample_jobs.title
);
