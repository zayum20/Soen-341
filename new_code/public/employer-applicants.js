const applicantsList = document.getElementById("applicants-list");
const applicantsMessage = document.getElementById("applicants-message");

function showApplicantsMessage(message) {
    applicantsMessage.hidden = false;
    applicantsMessage.textContent = message;
}

function statusOptions(currentStatus) {
    return APPLICATION_STATUSES.map((status) => `
        <option value="${escapeHtml(status)}" ${status === currentStatus ? "selected" : ""}>
            ${escapeHtml(status)}
        </option>
    `).join("");
}

async function saveStatus(applicationId, status, messageElement, button) {
    messageElement.hidden = true;
    button.disabled = true;

    try {
        const response = await fetch(`/api/employer/applications/${applicationId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                status: status
            })
        });

        const data = await response.json();
        messageElement.hidden = false;
        messageElement.textContent = data.message || "Could not update application status.";
        messageElement.className = response.ok
            ? "save-message success"
            : "save-message error";
    } catch (error) {
        console.error("Status update error:", error);
        messageElement.hidden = false;
        messageElement.textContent = "Could not connect to the server.";
        messageElement.className = "save-message error";
    } finally {
        button.disabled = false;
    }
}

async function loadApplicants() {
    try {
        const profile = await requireRole("employer", "Profile.html");

        if (!profile) {
            return;
        }

        const response = await fetch("/api/employer/applications");

        if (response.status === 401) {
            window.location.href = "login.html";
            return;
        }

        const applicants = await response.json();

        if (!response.ok) {
            showApplicantsMessage(applicants.message || "Could not load applicants.");
            return;
        }

        if (applicants.length === 0) {
            showApplicantsMessage("No one has applied to your jobs yet.");
            return;
        }

        applicantsList.innerHTML = applicants.map((applicant) => {
            const name = `${applicant.first_name || ""} ${applicant.last_name || ""}`.trim();

            return `
                <article class="application-card" data-application-id="${escapeHtml(applicant.id)}">
                    <h2>${escapeHtml(name || "Job seeker")}</h2>
                    <p class="application-meta">${escapeHtml(applicant.email || "")}</p>
                    <p class="application-meta">${escapeHtml(applicant.job_title)}</p>
                    <p class="application-meta">Applied ${escapeHtml(formatDate(applicant.applied_at))}</p>
                    ${applicant.cover_note ? `<p class="cover-note">${escapeHtml(applicant.cover_note)}</p>` : ""}
                    <div class="status-row">
                        <label for="status-${escapeHtml(applicant.id)}">Status</label>
                        <select id="status-${escapeHtml(applicant.id)}">
                            ${statusOptions(applicant.status)}
                        </select>
                        <button type="button" class="save-status">Save status</button>
                    </div>
                    <p class="save-message" hidden></p>
                </article>
            `;
        }).join("");

        applicantsList.querySelectorAll(".application-card").forEach((card) => {
            const button = card.querySelector(".save-status");
            const select = card.querySelector("select");
            const messageElement = card.querySelector(".save-message");

            button.addEventListener("click", () => {
                saveStatus(
                    card.dataset.applicationId,
                    select.value,
                    messageElement,
                    button
                );
            });
        });
    } catch (error) {
        console.error("Applicants error:", error);
        showApplicantsMessage("Could not load applicants.");
    }
}

loadApplicants();
