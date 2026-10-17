
/*
 * CareerConnect - Sprint 2
 * Job Listings Frontend
 *
 * Purpose:
 * Display available jobs dynamically on jobs.html.
 *
 * For now, jobs are stored in a temporary JavaScript array.
 * Later, the data will come from GET /api/jobs.
 */

// An array holds multiple job objects.
// Each object represents one row in the jobs database table.
const jobs = [
    {
        id: 1,
        employer_id: 101,
        title: "Software Developer Intern",
        company: "Example Tech",
        location: "Montreal, QC",
        category: "Software Development",
        description: "Assist with developing web applications.",
        job_type: "Internship",
        created_at: "2026-10-15"
    },
    {
        id: 2,
        employer_id: 102,
        title: "Junior Web Developer",
        company: "Example Digital",
        location: "Remote",
        category: "Web Development",
        description: "Develop and maintain websites.",
        job_type: "Full-time",
        created_at: "2026-10-14"
    },
    {
        id: 3,
        employer_id: 103,
        title: "Data Analyst Intern",
        company: "Example Analytics",
        location: "Laval, QC",
        category: "Data Analytics",
        description: "Analyze data and prepare reports.",
        job_type: "Internship",
        created_at: "2026-10-13"
    }
];

// Find the HTML container whose id is "job-list".
// This is where JavaScript will display our job cards.


// This function displays all jobs passed to it.
// The parameter jobsToDisplay represents an array of jobs.
function displayJobs(jobsToDisplay) {

    // Remove previously displayed cards.
    // This prevents duplicate cards if the function runs again.
    jobList.replaceChildren();

    // If there are no jobs, display a helpful message.
    if (jobsToDisplay.length === 0) {

        // Create a new paragraph element in memory.
        const message = document.createElement("p");

        // Set the paragraph text.
        message.textContent = "No job opportunities available.";

        // Add the paragraph to the webpage.
        jobList.appendChild(message);

        // Stop running this function.
        return;
    }

    // Loop through every job in the array.
    // The variable job represents the current job object.
    jobsToDisplay.forEach(function(job) {

        // Create an article element for one job card.
        const card = document.createElement("article");

        // Apply the existing job-card CSS class.
        card.className = "job-card";

        // Create the heading for the job title.
        const title = document.createElement("h3");

        // Use the title property from the job object.
        title.textContent = job.title;

        // Create a paragraph for the company name.
        const company = document.createElement("p");

        // Apply the existing company CSS class.
        company.className = "job-company";

        // Display the company name from the job data.
        company.textContent = job.company;

        // Create a paragraph for the job location.
        const location = document.createElement("p");

        // Apply the location CSS class.
        location.className = "job-location";

        // Display the location from the job data.
        location.textContent = job.location;

        // Create a span for the job type badge.
        const type = document.createElement("span");

        // Apply the job-type CSS class.
        type.className = "job-type";

        // Display the type of employment.
        type.textContent = job.job_type;

        // Create a link for viewing the job details.
        const details = document.createElement("a");

        // For now, this is a placeholder.
        // Tasneem will integrate the job details feature later.
        details.href = "#";

        // Apply the existing job-details CSS class.
        details.className = "job-details";

        // Set the visible text of the link.
        details.textContent = "View Details →";

        // Add all elements to the job card in order.
        card.appendChild(title);
        card.appendChild(company);
        card.appendChild(location);
        card.appendChild(type);
        card.appendChild(details);

        // Finally, insert the completed card into the webpage.
        jobList.appendChild(card);
    });
}

// Call the function to display our temporary sample jobs.


/*
 * Retrieve real job postings from the backend.
 * The backend reads the jobs table in MySQL.
 */

// async allows this function to wait for asynchronous operations.
async function loadJobs() {

    // try contains code that might fail.
    try {

        // Send a GET request to our Express backend.
        // await waits for the server's response.
        const response = await fetch("/api/jobs");

        // Check whether the server returned an error.
        // response.ok is true for HTTP statuses 200-299.
        if (!response.ok) {

            // Stop execution and move to the catch block.
            throw new Error("Failed to retrieve jobs.");
        }

        // Convert the JSON response into JavaScript data.
        // The backend returns an array of job objects.
        const jobs = await response.json();

        // Pass the retrieved jobs to our existing function.
        // This creates one job card per database record.
        displayJobs(jobs);

    } catch (error) {

        // Print the error in the browser's developer console.
        console.error("Error loading jobs:", error);

        // Clear any previously displayed job cards.
        jobList.replaceChildren();

        // Create a paragraph explaining the problem.
        const message = document.createElement("p");

        // Display a user-friendly error message.
        message.textContent = "Unable to load jobs. Please try again later.";

        // Add the message to the webpage.
        jobList.appendChild(message);
    }
}

// Call the function when the page loads.
loadJobs();

