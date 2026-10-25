// Stage 1: Recruiter Dashboard. Uses existing API routes; no database schema changes.
// Keep the form locked until the account is verified, and track pending submissions.
const byId = (id) => document.getElementById(id);
let employerVerified = false;
let posting = false;

// Preserve the existing sidebar toggle and its accessibility state.
const hamburger = byId('hamburger');
hamburger?.addEventListener('click', () => {
    const collapsed = document.body.classList.toggle('nav-collapsed');
    hamburger.setAttribute('aria-expanded', String(!collapsed));
});

// Reuse the page status areas for loading, success, and error feedback.
function message(id, text) {
    const element = byId(id);
    element.textContent = text;
    element.hidden = !text;
}

// Stop posting and redirect if an API request reports an expired or forbidden session.
// The server still enforces permissions; this check controls the page experience.
function checkAccess(response) {
    if (response.status === 401 || response.status === 403) {
        employerVerified = false;
        byId('job-fields').disabled = true;
        window.location.href = response.status === 401 ? 'login.html' : 'Profile.html';
        throw new Error('Your session does not allow access to this dashboard.');
    }
}

// Format valid dates for the browser locale; handle missing or invalid dates.
function dateLabel(value) {
    const date = value ? new Date(value) : null;
    return date && !Number.isNaN(date.getTime()) ? date.toLocaleDateString() : 'Date unavailable';
}

// Use textContent for server-provided values so names and titles stay plain text.
function addCard(list, heading, details) {
    const card = document.createElement('article');
    const title = document.createElement('h3');
    title.textContent = heading;
    card.append(title);
    details.forEach((detail) => {
        const line = document.createElement('p');
        line.textContent = detail;
        card.append(line);
    });
    list.append(card);
}

// Load either jobs or applications using the same rendering and retry flow.
// Each call catches its own errors, so one failed section cannot block the other.
async function loadActivity(kind) {
    if (!employerVerified) return;
    const jobs = kind === 'jobs';
    const counter = byId(jobs ? 'total-jobs' : 'total-applications');
    const list = byId(jobs ? 'recent-jobs' : 'recent-applications');
    const retry = byId('retry-' + kind);
    retry.hidden = true;
    retry.disabled = true;
    list.replaceChildren();
    counter.textContent = 'Loading...';
    message(kind + '-message', 'Loading ' + kind + '...');
    try {
        const response = await fetch('/api/employer/' + kind);
        checkAccess(response);
        if (!response.ok) throw new Error('Could not load ' + kind + '.');
        const items = await response.json();
        if (!Array.isArray(items) || items.some(item => !item || typeof item !== 'object' || Array.isArray(item))) {
            throw new Error('Unexpected response.');
        }
        // Count every returned record, but show only the five most recent below.
        counter.textContent = String(items.length);
        message(kind + '-message', items.length ? '' : (jobs ? 'You have not posted any jobs yet.' : 'No applications have been received yet.'));
        // Both existing endpoints return newest records first.
        items.slice(0, 5).forEach(item => {
            if (jobs) {
                addCard(list, item.title || 'Untitled job', [
                    [item.location || 'Location not listed', item.job_type || 'Job type not listed'].join(' · '),
                    'Posted ' + dateLabel(item.created_at)
                ]);
            } else {
                const name = [item.first_name, item.last_name].filter(Boolean).join(' ');
                addCard(list, name || 'Job seeker', [item.job_title || 'Job title unavailable',
                    'Status: ' + (item.status || 'Unavailable'), 'Applied ' + dateLabel(item.applied_at)]);
            }
        });
    } catch (error) {
        // A failed request is not an empty list. Never display a misleading zero.
        // This also handles the missing applications table without changing the database.
        counter.textContent = 'Unavailable';
        message(kind + '-message', 'Could not load ' + kind + '. Please try again.');
        retry.hidden = false;
        console.error('Dashboard activity:', error);
    } finally {
        retry.disabled = false;
    }
}

// Verify the account before enabling the posting form or requesting employer activity.
async function loadProfile() {
    employerVerified = false;
    byId('job-fields').disabled = true;
    byId('retry-profile').hidden = true;
    message('dashboard-message', 'Checking your account...');
    try {
        const response = await fetch('/api/profile');
        checkAccess(response);
        if (!response.ok) throw new Error('Could not check your account.');
        const profile = await response.json();
        if (profile.role !== 'employer') {
            window.location.href = 'Profile.html';
            return;
        }
        employerVerified = true;
        byId('job-fields').disabled = false;
        message('dashboard-message', '');
        // A missing applications table must not block the working jobs section.
        await Promise.all([loadActivity('jobs'), loadActivity('applications')]);
    } catch (error) {
        message('dashboard-message', 'Could not verify your account. Please try again.');
        byId('retry-profile').hidden = false;
        ['jobs', 'applications'].forEach(kind => {
            byId(kind === 'jobs' ? 'total-jobs' : 'total-applications').textContent = 'Unavailable';
            message(kind + '-message', 'Account verification is required.');
        });
        console.error('Profile loading error:', error);
    }
}

// Retry only the failed section, or repeat verification when the account check failed.
byId('retry-profile').addEventListener('click', loadProfile);
['jobs', 'applications'].forEach(kind => {
    byId('retry-' + kind).addEventListener('click', () => loadActivity(kind));
});

// Preserve the existing posting form, with validation and inline feedback.
const jobForm = byId('create-job-form');
jobForm?.addEventListener('submit', async event => {
    event.preventDefault();
// Ignore repeat submissions while a request is pending; keep native required-field checks.
    if (posting || !employerVerified || !jobForm.reportValidity()) return;
    const jobData = {
        title: byId('jobTitle').value.trim(), company: byId('companyName').value.trim(),
        location: byId('location').value.trim(), category: byId('category').value,
        job_type: byId('jobType').value, description: byId('description').value.trim()
    };
    if (Object.values(jobData).some(value => !value)) {
        message('message-container', 'Please complete every field. Text cannot contain only spaces.');
        return;
    }
    posting = true;
    const button = jobForm.querySelector('button[type="submit"]');
    button.disabled = true;
    message('message-container', 'Posting job...');
    try {
        const response = await fetch('/api/jobs', {
            method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(jobData)
        });
        checkAccess(response);
        const result = await response.json();
        if (!response.ok) throw new Error(result.message || 'Could not post the job.');
// Clear fields only after success, then refresh the jobs count and recent jobs.
        jobForm.reset();
        message('message-container', 'Job posted successfully.');
        await loadActivity('jobs');
    } catch (error) {
        message('message-container', error.message || 'Could not post the job. Please try again.');
    } finally {
        posting = false;
        button.disabled = false;
    }
});

// Start verification when the page loads. Keep the original logout handler below.
loadProfile();

const logoutLink = document.getElementById('logout-link');

if (logoutLink) {

    logoutLink.addEventListener('click', async (event) => {

        event.preventDefault();

        try {

            const response = await fetch('/api/logout', {
                method: 'POST'
            });

            const data = await response.json();

            if (response.ok) {

                alert('You have been logged out.');

                window.location.href = 'login.html';

            } else {

                alert(data.message);

            }

        } catch (error) {

            console.error('Logout error:', error);

            alert('Could not connect to the server.');

        }

    });

}