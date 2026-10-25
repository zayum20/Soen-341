const jobsList = document.getElementById("jobs-list");
const jobsMessage = document.getElementById("jobs-message");

function showJobsMessage(message) {
    jobsMessage.hidden = false;
    jobsMessage.textContent = message;
}

// Stage 3A: Only the latest search may update the page, even if responses arrive out of order.
let jobsRequestVersion = 0;
let lastJobsQuery = '';
const retryJobs = document.getElementById('retry-jobs');

async function loadJobs(query = "") {
    const version = ++jobsRequestVersion;
    lastJobsQuery = query;
    jobsList.innerHTML = '';
    jobsList.setAttribute('aria-busy', 'true');
    retryJobs.hidden = true;
    showJobsMessage('Loading jobs...');
    try {
        // Check the version before redirects as well as before rendering results.
        const profileResponse = await fetch('/api/profile');
        if (version !== jobsRequestVersion) return;
        if (profileResponse.status === 401) {
            window.location.href = 'login.html';
            return;
        }
        if (!profileResponse.ok) throw new Error('Could not verify your account. Please retry.');
        const profile = await profileResponse.json();
        if (version !== jobsRequestVersion) return;
        if (!profile || !['job_seeker', 'employer'].includes(profile.role)) {
            throw new Error('Could not verify your account. Please retry.');
        }
        if (profile.role !== 'job_seeker') {
            window.location.href = 'Employer_Dashboard.html';
            return;
        }

        const response = await fetch(`/api/jobs?q=${encodeURIComponent(query)}`);

        if (version !== jobsRequestVersion) return;
        if (response.status === 401) {
            window.location.href = "login.html";
            return;
        }

        const data = await response.json();

        if (version !== jobsRequestVersion) return;
        if (!response.ok) throw new Error(data.message || 'Could not load jobs.');
        if (!Array.isArray(data) || data.some(job => !job || typeof job !== 'object' || Array.isArray(job))) {
            throw new Error('Could not read the job results. Please retry.');
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
                ? escapeHtml(String(job.description).slice(0, 140))
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
        if (version !== jobsRequestVersion) return;
        console.error("Job list error:", error);
        showJobsMessage(error.message || 'Could not load jobs. Please retry.');
        retryJobs.hidden = false;
    } finally {
        if (version === jobsRequestVersion) jobsList.setAttribute('aria-busy', 'false');
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

// Retry the submitted query rather than any unsent text currently in the input.
retryJobs.addEventListener('click', () => loadJobs(lastJobsQuery));
loadJobs();
