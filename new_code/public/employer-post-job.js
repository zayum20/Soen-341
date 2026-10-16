const postForm = document.getElementById("post-job-form");
const postMessage = document.getElementById("post-message");
const myJobs = document.getElementById("my-jobs");
const publishButton = postForm.querySelector("button");

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
            <p class="application-meta">${escapeHtml(job.status === "open" ? "Open" : "Closed")}</p>
        </article>
    `).join("");
}

async function loadMyJobs() {
    const response = await fetch("/api/employer/jobs");

    if (response.status === 401) {
        window.location.href = "login.html";
        return;
    }

    const jobs = await response.json();

    if (!response.ok) {
        showPostMessage(jobs.message || "Could not load your job postings.", false);
        return;
    }

    renderMyJobs(jobs);
}

postForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    postMessage.hidden = true;
    publishButton.disabled = true;

    try {
        const response = await fetch("/api/jobs", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                title: document.getElementById("title").value,
                location: document.getElementById("location").value,
                jobType: document.getElementById("job-type").value,
                description: document.getElementById("description").value
            })
        });

        const data = await response.json();

        if (!response.ok) {
            showPostMessage(data.message || "Could not publish that job.", false);
            publishButton.disabled = false;
            return;
        }

        postForm.reset();
        showPostMessage("Job posting published. It is now on the main jobs page.", true);
        await loadMyJobs();
    } catch (error) {
        console.error("Post job error:", error);
        showPostMessage("Could not connect to the server.", false);
    } finally {
        publishButton.disabled = false;
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
