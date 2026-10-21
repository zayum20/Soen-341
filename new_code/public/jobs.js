const jobsList = document.getElementById("jobs-list");
const jobsMessage = document.getElementById("jobs-message");

function showJobsMessage(message) {
    jobsMessage.hidden = false;
    jobsMessage.textContent = message;
}

async function loadJobs(query = "") {
    try {
        const profile = await requireRole("job_seeker", "Employer_Profile.html");

        if (!profile) {
            return;
        }

        const response = await fetch(`/api/jobs?q=${encodeURIComponent(query)}`);

        if (response.status === 401) {
            window.location.href = "login.html";
            return;
        }

        const data = await response.json();

        if (!response.ok) {
            showJobsMessage(data.message || "Could not load jobs.");
            return;
        }

        if (data.length === 0) {
            jobsList.innerHTML = "";
            showJobsMessage(query
                ? "No open jobs match that search."
                : "No open jobs yet.");
            return;
        }

        jobsMessage.hidden = true;
        jobsList.innerHTML = data.map((job) => {
            const excerpt = job.description
                ? escapeHtml(job.description.slice(0, 140))
                : "";

            return `
                <a class="job-card" href="job.html?id=${encodeURIComponent(job.id)}">
                    <h2>${escapeHtml(job.title)}</h2>
                    <p class="job-meta">${escapeHtml(job.company_name || "Company")}</p>
                    <p class="job-meta">${escapeHtml(job.location || "Location not listed")} · ${escapeHtml(job.job_type || "Job type not listed")}</p>
                    ${excerpt ? `<p class="job-excerpt">${excerpt}</p>` : ""}
                </a>
            `;
        }).join("");
    } catch (error) {
        console.error("Job list error:", error);
        showJobsMessage("Could not load jobs.");
    }
}

const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("search-input");

if (searchForm && searchInput) {
    searchForm.addEventListener("submit", (event) => {
        event.preventDefault();
        loadJobs(searchInput.value.trim());
    });
}

loadJobs();
