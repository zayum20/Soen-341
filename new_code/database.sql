-- CareerConnect Database Setup
-- Creates the database tables required for the CareerConnect recruiting website.
-- This file contains the database structure only and does not include user data.

CREATE DATABASE IF NOT EXISTS recruiting_website;

USE recruiting_website;

-- Users
DROP TABLE IF EXISTS `job_seeker_skills`;
DROP TABLE IF EXISTS `job_seeker_profiles`;
DROP TABLE IF EXISTS `employer_profiles`;
DROP TABLE IF EXISTS `users`;

CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('job_seeker','employer') NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Employer Profiles
CREATE TABLE `employer_profiles` (
  `user_id` int NOT NULL,
  `company_name` varchar(255) NOT NULL,
  `contact_name` varchar(255) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  `about` text,
  `profile_picture` varchar(255) DEFAULT 'images/default.png',
  PRIMARY KEY (`user_id`),
  CONSTRAINT `employer_profiles_ibfk_1`
    FOREIGN KEY (`user_id`)
    REFERENCES `users` (`id`)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Job Seeker Profiles
CREATE TABLE `job_seeker_profiles` (
  `user_id` int NOT NULL,
  `first_name` varchar(100) NOT NULL,
  `last_name` varchar(100) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  `about` text,
  `profile_picture` varchar(255) DEFAULT 'images/default.png',
  PRIMARY KEY (`user_id`),
  CONSTRAINT `job_seeker_profiles_ibfk_1`
    FOREIGN KEY (`user_id`)
    REFERENCES `users` (`id`)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Job Seeker Skills
CREATE TABLE `job_seeker_skills` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `skill` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `job_seeker_skills_ibfk_1`
    FOREIGN KEY (`user_id`)
    REFERENCES `users` (`id`)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;