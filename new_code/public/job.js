const jobDetail = document.getElementById("job-detail");
const applyForm = document.getElementById("apply-form");
const applyButton = document.getElementById("apply-button");
const applyError = document.getElementById("apply-error");
const confirmation = document.getElementById("confirmation");
const pageMessage = document.getElementById("page-message");
const params = new URLSearchParams(window.location.search);
const jobId = Number(params.get("id"));

function showPageMessage(message) {
    pageMessage.hidden = false;
    pageMessage.textContent = message;
}

function showApplyError(message) {
    applyError.hidden = false;
    applyError.textContent = message;
}

function showConfirmation(heading, status) {
    confirmation.hidden = false;
    confirmation.innerHTML = `
        <h2>${escapeHtml(heading)}</h2>
        <p>Status: ${statusBadge(status)}</p>
        <p><a href="my-applications.html">View my applications</a></p>
    `;
}

function renderJob(job) {
    document.title = job.title;
    jobDetail.hidden = false;
    jobDetail.innerHTML = `
        <h2>${escapeHtml(job.title)}</h2>
        <p class="job-meta">${escapeHtml(job.company_name || "Company")}</p>
        <p class="job-meta">${escapeHtml(job.location || "Location not listed")} · ${escapeHtml(job.job_type || "Job type not listed")}</p>
        <p class="job-description">${escapeHtml(job.description || "No description provided.")}</p>
    `;
}

async function loadJob() {
    if (!Number.isInteger(jobId) || jobId <= 0) {
        showPageMessage("That job could not be found.");
        return;
    }

    try {
        const profileResponse = await fetch("/api/profile");
        const profile = profileResponse.ok
            ? await profileResponse.json()
            : null;

        const response = await fetch(`/api/jobs/${jobId}`);
        const job = await response.json();

        if (!response.ok) {
            showPageMessage(job.message || "Could not load that job.");
            return;
        }

        renderJob(job);

        if (job.alreadyApplied) {
            showConfirmation(
                "You have already applied to this job.",
                job.applicationStatus || "Applied"
            );
            return;
        }

        if (job.status !== "open") {
            showPageMessage("This job is not open for applications.");
            return;
        }

        if (!profile) {
            showPageMessage("Log in as a job seeker to apply for this job.");
            return;
        }

        if (profile.role !== "job_seeker") {
            showPageMessage("Employers can post jobs, but only job seekers can apply.");
            return;
        }

        applyForm.hidden = false;
    } catch (error) {
        console.error("Job detail error:", error);
        showPageMessage("Could not load that job.");
    }
}

applyForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    applyError.hidden = true;
    applyButton.disabled = true;

    try {
        const response = await fetch("/api/applications", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                jobId: jobId,
                coverNote: document.getElementById("cover-note").value
            })
        });

        const data = await response.json();

        if (response.ok) {
            applyForm.hidden = true;
            showConfirmation(
                data.message || "Application submitted successfully.",
                data.application?.status || "Applied"
            );
            return;
        }

        if (response.status === 409) {
            applyForm.hidden = true;
            showConfirmation(
                data.message || "You have already applied to this job.",
                "Applied"
            );
            return;
        }

        showApplyError(data.message || "Could not submit application.");
        applyButton.disabled = false;
    } catch (error) {
        console.error("Apply error:", error);
        showApplyError("Could not connect to the server.");
        applyButton.disabled = false;
    }
});

loadJob();
