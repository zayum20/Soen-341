-- Adds job postings and applications without dropping existing accounts.
-- Run this on the existing recruiting_website database.
-- Do not re-run database.sql on a database that already has users.
--
-- Sample jobs are attached to the first employer account.
-- Register an employer before running this file, or the seed inserts nothing.

USE recruiting_website;

CREATE TABLE IF NOT EXISTS `job_postings` (
  `id` int NOT NULL AUTO_INCREMENT,
  `employer_id` int NOT NULL,
  `title` varchar(255) NOT NULL,
  `location` varchar(255) DEFAULT NULL,
  `job_type` varchar(50) DEFAULT NULL,
  `description` text,
  `status` enum('open','closed') NOT NULL DEFAULT 'open',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `employer_id` (`employer_id`),
  CONSTRAINT `job_postings_ibfk_1`
    FOREIGN KEY (`employer_id`)
    REFERENCES `users` (`id`)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

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
    REFERENCES `job_postings` (`id`)
    ON DELETE CASCADE,
  CONSTRAINT `applications_ibfk_2`
    FOREIGN KEY (`job_seeker_id`)
    REFERENCES `users` (`id`)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO job_postings (employer_id, title, location, job_type, description, status)
SELECT
    employer.id,
    sample_jobs.title,
    sample_jobs.location,
    sample_jobs.job_type,
    sample_jobs.description,
    'open'
FROM (
    SELECT id
    FROM users
    WHERE role = 'employer'
    ORDER BY id
    LIMIT 1
) AS employer
CROSS JOIN (
    SELECT
        'Software Engineering Intern' AS title,
        'Montreal, QC' AS location,
        'Internship' AS job_type,
        'Help build product features, fix bugs, and work with a small engineering team on a hiring platform.' AS description
    UNION ALL
    SELECT
        'Frontend Developer',
        'Toronto, ON',
        'Full-time',
        'Build responsive web pages and work with designers on the experience job seekers use to find roles.'
    UNION ALL
    SELECT
        'Data Analyst',
        'Remote',
        'Full-time',
        'Review hiring data, prepare reports, and help the team understand which roles attract applicants.'
    UNION ALL
    SELECT
        'Customer Support Specialist',
        'Laval, QC',
        'Part-time',
        'Answer questions from job seekers and employers and keep support requests organized.'
) AS sample_jobs
WHERE NOT EXISTS (
    SELECT 1
    FROM job_postings
    WHERE job_postings.employer_id = employer.id
      AND job_postings.title = sample_jobs.title
);
