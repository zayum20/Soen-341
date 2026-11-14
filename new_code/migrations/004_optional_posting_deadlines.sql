USE recruiting_website;

-- UTC instant when applications close: next midnight after the selected Toronto date.
-- NULL means no deadline. Existing postings keep their current availability.
ALTER TABLE jobs ADD COLUMN deadline_at DATETIME NULL DEFAULT NULL;
CREATE INDEX jobs_deadline_at ON jobs (deadline_at);
