const jobsList = document.getElementById("jobs-list");
const jobsMessage = document.getElementById("jobs-message");
const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("search-input");
const accountLink = document.getElementById("account-link");
const registerLink = document.getElementById("register-link");

function showJobsMessage(message) {
    jobsMessage.hidden = false;
    jobsMessage.textContent = message;
}

function renderJobs(jobs) {
    if (jobs.length === 0) {
        jobsList.innerHTML = "";
        showJobsMessage(query
            ? "No open jobs match that search."
            : "No open jobs yet.");
        return;
    }

    jobsMessage.hidden = true;
    jobsList.innerHTML = jobs.map((job) => {
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
}

async function loadJobs(query) {
    try {
        const response = await fetch(`/api/jobs?q=${encodeURIComponent(query)}`);
        const data = await response.json();

        if (!response.ok) {
            showJobsMessage(data.message || "Could not load jobs.");
            return;
        }

        renderJobs(data);
    } catch (error) {
        console.error("Job list error:", error);
        showJobsMessage("Could not load jobs.");
    }
}

async function showAccountLink() {
    try {
        const response = await fetch("/api/profile");

        if (!response.ok) {
            return;
        }

        const profile = await response.json();
        accountLink.textContent = "My Profile";
        accountLink.href = profile.role === "employer"
            ? "Employer_Profile.html"
            : "Profile.html";
        registerLink.hidden = true;
    } catch (error) {
        console.error("Account link error:", error);
    }
}

searchForm.addEventListener("submit", (event) => {
    event.preventDefault();
    loadJobs(searchInput.value.trim());
});

showAccountLink();
loadJobs("");
