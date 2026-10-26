1 - Job Details Page (job.html and job.js):
Redesigned the job details page to have a two-column layout
Left sidebar displays job data: Company, Location, and Job Type
Main section has an overview tab (in case we want to add a manual application form later)
Isolated styling in job.css
2 - Jobs Search and Filtering (jobs.html and jobs.js):
Added a pill search bar
Entered five pill filtering options: Location, Job Type, Category, Company, and Date Posted
Added "Apply filters" and "Clear filters" buttons to add filters or reset all filters at once.
Added a dynamic "X matching jobs" counter.
Isolated styling in jobs-filter.css.
3 - Backend (sever/server.js)
Added a job category (jobs.category) to /api/jobs SELECT query to allow Job Category based filtering.
Also I added the Project Directory Tree to GitHub ReadME, please check it out and see if you need to add/remove any files or folders.
