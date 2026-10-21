const applicationsList = document.getElementById("applications-list");
const applicationsMessage = document.getElementById("applications-message");

function showApplicationsMessage(message) {
    applicationsMessage.hidden = false;
    applicationsMessage.textContent = message;
}

async function loadApplications() {
    try {
        const profile = await requireRole("job_seeker", "Employer_Profile.html");

        if (!profile) {
            return;
        }

        const response = await fetch("/api/applications/mine");

        if (response.status === 401) {
            window.location.href = "login.html";
            return;
        }

        const applications = await response.json();

        if (!response.ok) {
            showApplicationsMessage(applications.message || "Could not load your applications.");
            return;
        }

        if (applications.length === 0) {
            showApplicationsMessage("You have not applied to any jobs yet.");
            return;
        }

        applicationsList.innerHTML = applications.map((application) => `
            <article class="application-card">
                <h2>${escapeHtml(application.title)}</h2>
                <p class="application-meta">${escapeHtml(application.company_name || "Company")}</p>
                <p class="application-meta">${escapeHtml(application.location || "Location not listed")}</p>
                <p class="application-meta">Applied ${escapeHtml(formatDate(application.applied_at))}</p>
                <p>${statusBadge(application.status)}</p>
            </article>
        `).join("");
    } catch (error) {
        console.error("Applications error:", error);
        showApplicationsMessage("Could not load your applications.");
    }
}

loadApplications();
