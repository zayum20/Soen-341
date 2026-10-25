// Stage 3B: Keep a local copy for status filtering; no extra database requests on filter changes.
const applicantsList = document.getElementById('applicants-list');
const applicantsMessage = document.getElementById('applicants-message');
const statusFilter = document.getElementById('status-filter');
const retryList = document.getElementById('retry-applicants');
let records = [];
let listLoading = false;
let statusSaving = false;

function showApplicantsMessage(text) {
    applicantsMessage.textContent = text;
    applicantsMessage.hidden = !text;
}

function renderApplicants() {
    const visible = records.filter(record => !statusFilter.value || record.status === statusFilter.value);
    applicantsList.innerHTML = '';
    if (!visible.length) {
        showApplicantsMessage(records.length ? 'No applications match this status.' : 'No one has applied to your jobs yet.');
        return;
    }
    showApplicantsMessage('');
        applicantsList.innerHTML = visible.map((applicant) => {
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
                    <p class="save-message" role="status" hidden></p>
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
                    button,
                    select
                );
            });
        });
}

function statusOptions(currentStatus) {
    // Preserve unknown future statuses until the recruiter deliberately selects a supported one.
    const unknown = APPLICATION_STATUSES.includes(currentStatus) ? ''
        : `<option value="" selected disabled>${escapeHtml(currentStatus || 'Select a status')}</option>`;
    return unknown + APPLICATION_STATUSES.map((status) => `
        <option value="${escapeHtml(status)}" ${status === currentStatus ? "selected" : ""}>
            ${escapeHtml(status)}
        </option>
    `).join("");
}

// Lock the affected controls while saving and update the cached status only on success.
async function saveStatus(applicationId, status, messageElement, button, select) {
    if (statusSaving || listLoading) return;
    const record = records.find(item => String(item.id) === String(applicationId));
    if (!record || !APPLICATION_STATUSES.includes(status)) return;
    if (record.status === status) {
        messageElement.hidden = false;
        messageElement.textContent = 'This status is already saved.';
        return;
    }
    statusSaving = true;
    statusFilter.disabled = true;
    button.disabled = true;
    select.disabled = true;
    button.textContent = 'Saving...';
    messageElement.hidden = false;
    messageElement.textContent = 'Saving status...';
    try {
        const response = await fetch(`/api/employer/applications/${encodeURIComponent(applicationId)}`, {
            method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status })
        });
        if (response.status === 401 || response.status === 403) {
            window.location.href = response.status === 401 ? 'login.html' : 'Dashboard.html';
            return;
        }
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Could not save the status.');
        record.status = status;
        // Reapply the filter so a card moves out of its old status immediately after a successful save.
        renderApplicants();
        showApplicantsMessage('Application status saved as ' + status + '.');
    } catch (error) {
        select.value = APPLICATION_STATUSES.includes(record.status) ? record.status : '';
        messageElement.textContent = error.message || 'Could not save the status. Please try again.';
        messageElement.className = 'save-message error';
    } finally {
        statusSaving = false;
        statusFilter.disabled = false;
        button.disabled = false;
        select.disabled = false;
        button.textContent = 'Save status';
    }
}

async function loadApplicants() {
    if (listLoading || statusSaving) return;
    listLoading = true;
    statusFilter.disabled = true;
    retryList.hidden = true;
    retryList.disabled = true;
    records = [];
    applicantsList.innerHTML = '';
    applicantsList.setAttribute('aria-busy', 'true');
    showApplicantsMessage('Checking your account and loading applications...');
    try {
        const profile = await requireRole('employer', 'Dashboard.html');
        if (!profile) return;
        const response = await fetch('/api/employer/applications');
        if (response.status === 401 || response.status === 403) {
            window.location.href = response.status === 401 ? 'login.html' : 'Dashboard.html';
            return;
        }
        if (!response.ok) throw new Error('Could not load applications. Please try again.');
        const data = await response.json();
        if (!Array.isArray(data) || data.some(item => !item || typeof item !== 'object' || Array.isArray(item))) {
            throw new Error('Could not read the applications. Please try again.');
        }
        records = data;
        statusFilter.disabled = false;
        renderApplicants();
    } catch (error) {
        // Database or profile failures stay visible instead of pretending the account has no applications.
        showApplicantsMessage(error.message || 'Could not load applications. Please try again.');
        retryList.hidden = false;
    } finally {
        listLoading = false;
        retryList.disabled = false;
        applicantsList.setAttribute('aria-busy', 'false');
    }
}
statusFilter.addEventListener('change', renderApplicants);
retryList.addEventListener('click', loadApplicants);
loadApplicants();
