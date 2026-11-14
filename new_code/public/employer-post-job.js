const postForm = document.getElementById("post-job-form");
const postMessage = document.getElementById("post-message");
const myJobs = document.getElementById("my-jobs");
const publishButton = postForm.querySelector("button[type=submit]");

// A null ID means create mode; an ID means save changes to that existing job.
let editingJobId = null;
let saving = false;
// Archiving has its own pending flag so repeat clicks cannot send duplicate requests.
let archiving = false;
const cancelEdit = document.getElementById("cancel-edit");
const fieldIds = { title: "title", company: "company", location: "location", category: "category", job_type: "job-type", description: "description" };

// Reuse the same form for creating and editing so both flows collect the same fields.
function beginEdit(job) {
    if (saving || archiving) return;
    editingJobId = job.id;
    Object.entries(fieldIds).forEach(([field, id]) => {
        document.getElementById(id).value = job[field] || "";
    });
    // Restore the date in Toronto, rather than displaying the next day's UTC date.
    document.getElementById("application-deadline").value = deadlineInputValue(job.deadline_at);
    publishButton.textContent = "Save changes";
    cancelEdit.hidden = false;
    showPostMessage("Editing: " + job.title, true);
    document.getElementById("title").focus();
}

function resetPostingForm() {
    editingJobId = null;
    postForm.reset();
    publishButton.textContent = "Publish job";
    cancelEdit.hidden = true;
}

cancelEdit.addEventListener("click", () => {
    if (saving || archiving) return;
    resetPostingForm();
    postMessage.hidden = true;
});

function showPostMessage(message, success) {
    postMessage.hidden = false;
    postMessage.textContent = message;
    postMessage.className = success
        ? "save-message success"
        : "save-message error";
}

function renderMyJobs(jobs) {
    if (jobs.length === 0) {
        myJobs.innerHTML = `<p class="page-message">You have not posted any jobs yet.</p>`;
        return;
    }

    myJobs.innerHTML = jobs.map((job) => `
        <article class="application-card">
            <h2>${escapeHtml(job.title)}</h2>
            <p class="application-meta">${escapeHtml(job.location || "Location not listed")} · ${escapeHtml(job.job_type || "Job type not listed")}</p>
            <p class="application-meta">${escapeHtml(job.archived_at || job.status === "archived" ? "Archived" : "Open")}</p>
            <p class="application-meta">${escapeHtml(deadlineLabel(job.deadline_at))}</p>
            <button type="button" class="edit-posting">Edit posting</button>
            <button type="button" class="archive-posting" data-job-id="${escapeHtml(job.id)}" ${job.archived_at ? "disabled" : ""}>${job.archived_at ? "Archived" : "Archive posting"}</button>
        </article>
    `).join("");
    // Bind each button to its own job object instead of putting posting data in HTML.
    myJobs.querySelectorAll(".edit-posting").forEach((button, index) => {
        button.disabled = saving;
        button.addEventListener("click", () => beginEdit(jobs[index]));
    });
    // Use the job ID to find the matching record, including when some jobs are archived.
    myJobs.querySelectorAll(".archive-posting").forEach(button => {
        const job = jobs.find(item => String(item.id) === button.dataset.jobId);
        button.disabled = Boolean(job.archived_at) || saving || archiving;
        button.addEventListener("click", () => archivePosting(job));
    });
}

// Archive only after confirmation. No job or application records are deleted.
async function archivePosting(job) {
    if (saving || archiving || job.archived_at) return;
    if (!window.confirm('Archive "' + job.title + '"? It will disappear from seeker search and stop accepting applications. Existing applications will remain accessible.')) return;
    archiving = true;
    postForm.querySelectorAll("input, select, textarea, button").forEach(control => control.disabled = true);
    myJobs.querySelectorAll("button").forEach(button => button.disabled = true);
    try {
        const response = await fetch("/api/jobs/" + encodeURIComponent(job.id) + "/archive", { method: "PUT" });
        if (response.status === 401) {
            window.location.href = "login.html";
            return;
        }
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Could not archive posting.");
        // Clear an edit of this posting only after its archive request succeeds.
        if (String(editingJobId) === String(job.id)) resetPostingForm();
        showPostMessage("Posting archived. Existing applications remain accessible.", true);
    } catch (error) {
        showPostMessage(error.message || "Could not connect to the server.", false);
    } finally {
        archiving = false;
        postForm.querySelectorAll("input, select, textarea, button").forEach(control => control.disabled = false);
        // Reload saved state so archived buttons stay disabled and failed requests can be retried.
        await loadMyJobs();
    }
}

async function loadMyJobs() {
    // A list refresh can fail after a successful save; report that separately.
    try {
        const response = await fetch("/api/employer/jobs");
        if (response.status === 401) {
            window.location.href = "login.html";
            return;
        }
        const jobs = await response.json();
        if (!response.ok || !Array.isArray(jobs)) throw new Error("Could not load your job postings.");
        renderMyJobs(jobs);
    } catch (error) {
        myJobs.textContent = "Could not refresh your postings. Refresh the page to try again.";
    }
}

postForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (saving || archiving || !postForm.reportValidity()) return;
    const jobData = Object.fromEntries(Object.entries(fieldIds).map(([field, id]) =>
        [field, document.getElementById(id).value.trim()]));
    if (Object.values(jobData).some(value => !value)) {
        showPostMessage("Please complete every field. Text cannot contain only spaces.", false);
        return;
    }
    // Add the optional date after required-field checks, so blank remains valid.
    // Sending blank while editing removes a previously saved deadline.
    jobData.application_deadline = document.getElementById("application-deadline").value;
    const wasEditing = editingJobId !== null;
    saving = true;
    postMessage.hidden = true;
    // Lock controls while saving so switching jobs cannot change the request's target.
    postForm.querySelectorAll("input, select, textarea, button").forEach(control => control.disabled = true);
    myJobs.querySelectorAll("button").forEach(button => button.disabled = true);

    try {
        const response = await fetch(wasEditing ? "/api/jobs/" + encodeURIComponent(editingJobId) : "/api/jobs", {
            method: wasEditing ? "PUT" : "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(jobData)
        });

        const data = await response.json();

        if (!response.ok) {
            showPostMessage(data.message || "Could not publish that job.", false);
            publishButton.disabled = false;
            return;
        }

        // Clear the form only after the server confirms the database write succeeded.
        resetPostingForm();
        showPostMessage(wasEditing ? "Posting changes saved." : "Job posting published. It is now on the main jobs page.", true);
        await loadMyJobs();
    } catch (error) {
        console.error("Post job error:", error);
        showPostMessage("Could not connect to the server.", false);
    } finally {
        saving = false;
        postForm.querySelectorAll("input, select, textarea, button").forEach(control => control.disabled = false);
        myJobs.querySelectorAll(".edit-posting").forEach(button => button.disabled = false);
        myJobs.querySelectorAll(".archive-posting").forEach(button => {
            button.disabled = button.textContent === "Archived";
        });
    }
});

async function startPage() {
    const profile = await requireRole("employer", "Profile.html");

    if (!profile) {
        return;
    }

    loadMyJobs();
}

startPage();
