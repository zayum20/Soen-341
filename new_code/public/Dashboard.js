// Stage 2: Job Seeker Dashboard. Read existing API data without changing the database.
const seekerElement = id => document.getElementById(id);
const seekerCountIds = ['total', 'applied', 'under-review', 'interview', 'offered', 'rejected'];
let seekerVerified = false;
let accountLoading = false;
let applicationsLoading = false;

function seekerMessage(id, text) {
    const element = seekerElement(id);
    element.textContent = text;
    element.hidden = !text;
}

function setSeekerCounts(value) {
    seekerCountIds.forEach(id => { seekerElement('count-' + id).textContent = String(value); });
}

// Use textContent for all server values, so a title or company name cannot become HTML.
function renderSeekerApplication(application) {
    const card = document.createElement('article');
    const heading = document.createElement('h3');
    heading.textContent = application.title || 'Job title unavailable';
    card.append(heading);
    const details = [application.company_name || 'Company not listed',
        application.location || 'Location not listed',
        'Status: ' + (application.status || 'Unavailable'),
        'Applied ' + (formatDate(application.applied_at) || 'Date unavailable')];
    details.forEach(detail => {
        const line = document.createElement('p');
        line.textContent = detail;
        card.append(line);
    });
    seekerElement('recent-applications').append(card);
}

async function loadSeekerApplications() {
    // Avoid overlapping retries and do not fetch private data until the account is verified.
    if (!seekerVerified || applicationsLoading) return;
    applicationsLoading = true;
    const retry = seekerElement('retry-applications');
    retry.hidden = true;
    retry.disabled = true;
    seekerElement('application-section').setAttribute('aria-busy', 'true');
    seekerElement('recent-applications').replaceChildren();
    setSeekerCounts('Loading...');
    seekerMessage('applications-message', 'Loading applications...');
    try {
        const response = await fetch('/api/applications/mine');
        if (response.status === 401 || response.status === 403) {
            seekerVerified = false;
            window.location.href = response.status === 401 ? 'login.html' : 'Employer_Dashboard.html';
            return;
        }
        if (!response.ok) throw new Error('Could not load applications.');
        const applications = await response.json();
        if (!Array.isArray(applications) || applications.some(item => !item || typeof item !== 'object' || Array.isArray(item))) {
            throw new Error('Unexpected applications response.');
        }
        setSeekerCounts(0);
        seekerElement('count-total').textContent = String(applications.length);
        // Match the same five status names used by the existing application pages.
        APPLICATION_STATUSES.forEach(status => {
            const id = status.toLowerCase().replace(/\s+/g, '-');
            seekerElement('count-' + id).textContent = String(applications.filter(item => item.status === status).length);
        });
        // Unknown future statuses still count toward the total and remain visible in recent activity.
        const unknownStatus = applications.some(item => !APPLICATION_STATUSES.includes(item.status));
        seekerMessage('applications-message', applications.length === 0
            ? 'You have not applied to any jobs yet. Find jobs to get started.'
            : unknownStatus ? 'Some applications have a status outside the categories above; they are included in the total.' : '');
        // The existing endpoint sorts applications by applied_at, newest first.
        applications.slice(0, 5).forEach(renderSeekerApplication);
    } catch (error) {
        // Missing tables, server failures, and network problems are errors, not zero applications.
        setSeekerCounts('Unavailable');
        seekerMessage('applications-message', 'Could not load your applications. Please try again.');
        retry.hidden = false;
        console.error('Dashboard applications:', error);
    } finally {
        applicationsLoading = false;
        retry.disabled = false;
        seekerElement('application-section').setAttribute('aria-busy', 'false');
    }
}

async function startSeekerDashboard() {
    if (accountLoading) return;
    accountLoading = true;
    seekerVerified = false;
    const retry = seekerElement('retry-account');
    retry.hidden = true;
    retry.disabled = true;
    seekerMessage('account-message', 'Checking your account...');
    try {
        const profile = await requireRole('job_seeker', 'Employer_Dashboard.html');
        if (!profile) return;
        seekerVerified = true;
        seekerMessage('account-message', '');
        const name = typeof profile.first_name === 'string' ? profile.first_name.trim() : '';
        seekerElement('welcome-message').textContent = name
            ? 'Welcome, ' + name + '. Track your applications and plan your next career move.'
            : 'Track your applications and plan your next career move.';
        await loadSeekerApplications();
    } catch (error) {
        // A missing resume_path column currently makes /api/profile fail for job seekers.
        // Show the verification failure rather than bypassing account checks or editing the schema.
        setSeekerCounts('Unavailable');
        seekerMessage('account-message', 'Could not verify your account. Please try again.');
        seekerMessage('applications-message', 'Account verification is required to load applications.');
        seekerElement('application-section').setAttribute('aria-busy', 'false');
        retry.hidden = false;
        console.error('Dashboard account:', error);
    } finally {
        accountLoading = false;
        retry.disabled = false;
    }
}

seekerElement('retry-account').addEventListener('click', startSeekerDashboard);
seekerElement('retry-applications').addEventListener('click', loadSeekerApplications);
startSeekerDashboard();
