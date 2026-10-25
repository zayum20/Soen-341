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

// Stage 3A: Retry loading without submitting an application or altering the note.
const retryJob = document.getElementById('retry-job');
let jobLoading = false;
async function loadJob() {
    if (jobLoading || applicationSubmitting) return;
    if (!Number.isInteger(jobId) || jobId <= 0) {
        showPageMessage('That job could not be found.');
        return;
    }
    jobLoading = true;
    retryJob.hidden = true;
    retryJob.disabled = true;
    applyForm.hidden = true;
    confirmation.hidden = true;
    jobDetail.hidden = true;
    jobDetail.setAttribute('aria-busy', 'true');
    showPageMessage('Loading job...');
    try {
        // Only a 401 means logged out. A profile/server failure must not ask the user to log in again.
        let profile = null;
        let accountFailed = false;
        try {
            const profileResponse = await fetch('/api/profile');
            if (profileResponse.ok) {
                profile = await profileResponse.json();
                if (!profile || !['job_seeker', 'employer'].includes(profile.role)) accountFailed = true;
            } else if (profileResponse.status !== 401) {
                accountFailed = true;
            }
        } catch (error) {
            accountFailed = true;
        }
        const response = await fetch(`/api/jobs/${jobId}`);
        const job = await response.json();
        if (!response.ok) {
            showPageMessage(job.message || 'Could not load that job.');
            retryJob.hidden = response.status === 404;
            return;
        }
        if (!job || typeof job !== 'object' || Array.isArray(job) || typeof job.title !== 'string') {
            throw new Error('Unexpected job response.');
        }
        renderJob(job);
        pageMessage.hidden = true;
        if (accountFailed) {
            showPageMessage('Could not verify your account. Please retry before applying.');
            retryJob.hidden = false;
            return;
        }
        if (job.alreadyApplied) {
            showConfirmation('You have already applied to this job.', job.applicationStatus || 'Applied');
            return;
        }
        if (job.status !== 'open') {
            showPageMessage('This job is not open for applications.');
            return;
        }
        if (!profile) {
            showPageMessage('Log in as a job seeker to apply for this job.');
            return;
        }
        if (profile.role !== 'job_seeker') {
            showPageMessage('Employers can post jobs, but only job seekers can apply.');
            return;
        }
        applyForm.hidden = false;
    } catch (error) {
        console.error('Job detail error:', error);
        showPageMessage('Could not load that job. Please try again.');
        retryJob.hidden = false;
    } finally {
        jobLoading = false;
        retryJob.disabled = false;
        jobDetail.setAttribute('aria-busy', 'false');
    }
}
retryJob.addEventListener('click', loadJob);

// Stage 3B: Guard repeat requests and preserve the note when a submission fails.
let applicationSubmitting = false;
applyForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (applicationSubmitting || applyForm.hidden || !applyForm.reportValidity()) return;
    applicationSubmitting = true;
    applyError.hidden = true;
    applyButton.disabled = true;
    applyButton.textContent = 'Submitting...';
    applyForm.setAttribute('aria-busy', 'true');

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

        // Expired sessions and wrong-role accounts use the same redirects as the list pages.
        if (response.status === 401 || response.status === 403) {
            window.location.href = response.status === 401 ? 'login.html' : 'Employer_Dashboard.html';
            return;
        }
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
            // A conflict means an application exists, but does not tell us its current status.
            showPageMessage('You have already applied. Check My Applications for its current status.');
            retryJob.hidden = false;
            return;
        }

        showApplyError(data.message || "Could not submit application.");
        applyButton.disabled = false;
    } catch (error) {
        console.error("Apply error:", error);
        showApplyError("Could not connect to the server.");
    } finally {
        applicationSubmitting = false;
        applyButton.disabled = false;
        applyButton.textContent = 'Apply';
        applyForm.setAttribute('aria-busy', 'false');
    }
});

loadJob();
