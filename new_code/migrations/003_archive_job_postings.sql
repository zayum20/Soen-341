USE recruiting_website;

-- Add a nullable marker instead of deleting jobs, preserving every linked application.
-- Existing jobs start active because their archive date is NULL. Apply this file once.
ALTER TABLE jobs ADD COLUMN archived_at TIMESTAMP NULL DEFAULT NULL;
