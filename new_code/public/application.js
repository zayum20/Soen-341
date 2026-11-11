const detail = document.getElementById("application-detail");
const pageMessage = document.getElementById("application-message");
const applicationId = Number(new URLSearchParams(window.location.search).get("id"));

function showApplicationMessage(text) {
    pageMessage.hidden = !text;
    pageMessage.textContent = text;
}

function addLine(label, value) {
    const line = document.createElement("p");
    line.className = "application-meta";
    line.textContent = label + ": " + value;
    detail.append(line);
}

function renderApplication(application) {
    detail.hidden = false;
    detail.replaceChildren();
    const heading = document.createElement("h2");
    heading.textContent = application.title || "Job title unavailable";
    detail.append(heading);
    addLine("Company", application.company_name || "Company not listed");
    if (application.recruiter_name) {
        addLine("Recruiter", application.recruiter_name);
    }
    addLine("Location", application.location || "Location not listed");
    addLine("Type", application.job_type || "Job type not listed");
    addLine("Submitted", formatDate(application.applied_at) || "Date unavailable");
    if (application.updated_at) {
        addLine("Last updated", formatDate(application.updated_at) || "Date unavailable");
    }

    const status = document.createElement("p");
    if (APPLICATION_STATUSES.includes(application.status)) {
        status.innerHTML = "Status: " + statusBadge(application.status);
    } else {
        status.textContent = "Status: " + (application.status || "Unavailable");
    }
    detail.append(status);

    if (application.cover_note) {
        const note = document.createElement("p");
        note.className = "cover-note";
        note.textContent = application.cover_note;
        detail.append(note);
    }

    if (application.description) {
        const description = document.createElement("p");
        description.className = "job-description";
        description.textContent = application.description;
        detail.append(description);
    }

    const resume = document.createElement("p");
    if (application.has_submitted_resume) {
        const link = document.createElement("a");
        link.href = "/api/applications/" + encodeURIComponent(application.id) + "/resume";
        link.textContent = "Download " + (application.submitted_resume_original_name || "submitted resume");
        resume.append(link);
    } else {
        resume.className = "application-meta";
        resume.textContent = "No resume was submitted with this application.";
    }
    detail.append(resume);

    if (application.job_id) {
        const jobLink = document.createElement("p");
        const anchor = document.createElement("a");
        anchor.href = "job.html?id=" + encodeURIComponent(application.job_id);
        anchor.textContent = "View job posting";
        jobLink.append(anchor);
        detail.append(jobLink);
    }
}

async function loadApplication() {
    if (!Number.isInteger(applicationId) || applicationId <= 0) {
        showApplicationMessage("That application could not be found.");
        return;
    }

    showApplicationMessage("Checking your account...");
    try {
        const profile = await requireRole("job_seeker", "Employer_Dashboard.html");
        if (!profile) return;
        const response = await fetch("/api/applications/" + encodeURIComponent(applicationId));
        if (response.status === 401 || response.status === 403) {
            window.location.href = response.status === 401 ? "login.html" : "Employer_Dashboard.html";
            return;
        }
        const data = await response.json();
        if (!response.ok) {
            showApplicationMessage(data.message || "Could not load that application.");
            return;
        }
        showApplicationMessage("");
        renderApplication(data);
    } catch (error) {
        console.error("Application detail error:", error);
        showApplicationMessage("Could not load that application. Please try again.");
    }
}

loadApplication();
