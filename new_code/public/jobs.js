const jobsList = document.getElementById("jobs-list");
const jobsMessage = document.getElementById("jobs-message");
const retryJobs = document.getElementById("retry-jobs");

const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("search-input");

const filterLocation = document.getElementById("filter-location");
const filterType = document.getElementById("filter-type");
const filterCategory = document.getElementById("filter-category");
const filterCompany = document.getElementById("filter-company");
const filterDate = document.getElementById("filter-date");

const applyFiltersBtn = document.getElementById("apply-filters-btn");
const clearFiltersBtn = document.getElementById("clear-filters-btn");
const matchingJobsCount = document.getElementById("matching-jobs-count");

let allLoadedJobs = [];
let jobsRequestVersion = 0;
let lastJobsQuery = "";

function showJobsMessage(message) {
    jobsMessage.hidden = false;
    jobsMessage.textContent = message;
}

function updateChipHighlights() {
    [filterLocation, filterType, filterCategory, filterCompany, filterDate].forEach(chip => {
        if (!chip) return;
        if (chip.value) {
            chip.classList.add("has-value");
        } else {
            chip.classList.remove("has-value");
        }
    });
}

function populateFilterOptions(jobs) {
    if (!Array.isArray(jobs) || jobs.length === 0) return;

    // Helper to populate select with unique sorted values
    function fillSelect(selectEl, values, placeholder) {
        if (!selectEl) return;
        const currentVal = selectEl.value;
        const unique = Array.from(new Set(values.filter(Boolean).map(v => String(v).trim()))).sort();
        selectEl.innerHTML = `<option value="">${placeholder}</option>` +
            unique.map(val => `<option value="${escapeHtml(val)}">${escapeHtml(val)}</option>`).join("");
        if (currentVal && unique.includes(currentVal)) {
            selectEl.value = currentVal;
        }
    }

    fillSelect(filterLocation, jobs.map(j => j.location), "All locations");
    fillSelect(filterCategory, jobs.map(j => j.category), "All categories");
    fillSelect(filterCompany, jobs.map(j => j.company_name), "All companies");
}

function renderJobs(jobsToRender) {
    if (!jobsList) return;

    if (matchingJobsCount) {
        matchingJobsCount.textContent = `${jobsToRender.length} matching job${jobsToRender.length === 1 ? "" : "s"}`;
    }

    const hasActiveFilters = Boolean(
        (searchInput && searchInput.value.trim()) ||
        (filterLocation && filterLocation.value) ||
        (filterType && filterType.value) ||
        (filterCategory && filterCategory.value) ||
        (filterCompany && filterCompany.value) ||
        (filterDate && filterDate.value)
    );

    if (clearFiltersBtn) {
        clearFiltersBtn.hidden = !hasActiveFilters;
    }

    updateChipHighlights();

    if (jobsToRender.length === 0) {
        jobsList.innerHTML = "";
        showJobsMessage(hasActiveFilters ? "No open jobs match your filters." : "No open jobs yet.");
        return;
    }

    jobsMessage.hidden = true;
    jobsList.innerHTML = jobsToRender.map((job) => {
        const excerpt = job.description
            ? escapeHtml(String(job.description).slice(0, 140))
            : "";

        return `
            <a class="job-card" href="job.html?id=${encodeURIComponent(job.id)}">
                <h2>${escapeHtml(job.title)}</h2>
                <p class="job-meta">${escapeHtml(job.company_name || "Company")}</p>
                <p class="job-meta">${escapeHtml(job.location || "Location not listed")} · ${escapeHtml(job.job_type || "Job type not listed")}</p>
                ${excerpt ? `<p class="job-excerpt">${excerpt}</p>` : ""}
            </a>
        `;
    }).join("");
}

function applyFilters() {
    const query = searchInput ? searchInput.value.trim().toLowerCase() : "";
    const loc = filterLocation ? filterLocation.value.trim().toLowerCase() : "";
    const type = filterType ? filterType.value.trim().toLowerCase() : "";
    const cat = filterCategory ? filterCategory.value.trim().toLowerCase() : "";
    const comp = filterCompany ? filterCompany.value.trim().toLowerCase() : "";
    const days = filterDate ? Number(filterDate.value) : 0;

    const now = Date.now();

    const filtered = allLoadedJobs.filter((job) => {
        // Search query filter (matches title, company, location, category, or description)
        if (query) {
            const matchesQuery =
                (job.title && job.title.toLowerCase().includes(query)) ||
                (job.company_name && job.company_name.toLowerCase().includes(query)) ||
                (job.location && job.location.toLowerCase().includes(query)) ||
                (job.category && job.category.toLowerCase().includes(query)) ||
                (job.description && job.description.toLowerCase().includes(query));
            if (!matchesQuery) return false;
        }

        // Location filter
        if (loc && (!job.location || !job.location.toLowerCase().includes(loc))) {
            return false;
        }

        // Job type filter
        if (type && (!job.job_type || job.job_type.toLowerCase() !== type)) {
            return false;
        }

        // Category filter
        if (cat && (!job.category || job.category.toLowerCase() !== cat)) {
            return false;
        }

        // Company filter
        if (comp && (!job.company_name || job.company_name.toLowerCase() !== comp)) {
            return false;
        }

        // Date posted filter
        if (days > 0) {
            if (!job.created_at) return false;
            const createdAt = new Date(job.created_at).getTime();
            if (isNaN(createdAt)) return false;
            const diffDays = (now - createdAt) / (1000 * 60 * 60 * 24);
            if (diffDays > days) return false;
        }

        return true;
    });

    renderJobs(filtered);
}

function clearFilters() {
    if (searchInput) searchInput.value = "";
    if (filterLocation) filterLocation.value = "";
    if (filterType) filterType.value = "";
    if (filterCategory) filterCategory.value = "";
    if (filterCompany) filterCompany.value = "";
    if (filterDate) filterDate.value = "";

    applyFilters();
}

async function loadJobs(query = "") {
    const version = ++jobsRequestVersion;
    lastJobsQuery = query;
    jobsList.innerHTML = "";
    jobsList.setAttribute("aria-busy", "true");
    retryJobs.hidden = true;
    if (matchingJobsCount) matchingJobsCount.textContent = "";
    if (clearFiltersBtn) clearFiltersBtn.hidden = true;
    showJobsMessage("Loading jobs...");

    try {
        const profileResponse = await fetch("/api/profile");
        if (version !== jobsRequestVersion) return;
        if (profileResponse.status === 401) {
            window.location.href = "login.html";
            return;
        }
        if (!profileResponse.ok) throw new Error("Could not verify your account. Please retry.");
        const profile = await profileResponse.json();
        if (version !== jobsRequestVersion) return;
        if (!profile || !["job_seeker", "employer"].includes(profile.role)) {
            throw new Error("Could not verify your account. Please retry.");
        }
        if (profile.role !== "job_seeker") {
            window.location.href = "Employer_Dashboard.html";
            return;
        }

        const response = await fetch("/api/jobs");
        if (version !== jobsRequestVersion) return;
        if (response.status === 401) {
            window.location.href = "login.html";
            return;
        }

        const data = await response.json();
        if (version !== jobsRequestVersion) return;
        if (!response.ok) throw new Error(data.message || "Could not load jobs.");
        if (!Array.isArray(data) || data.some(job => !job || typeof job !== "object" || Array.isArray(job))) {
            throw new Error("Could not read the job results. Please retry.");
        }

        allLoadedJobs = data;
        populateFilterOptions(allLoadedJobs);
        applyFilters();

    } catch (error) {
        if (version !== jobsRequestVersion) return;
        console.error("Job list error:", error);
        showJobsMessage(error.message || "Could not load jobs. Please retry.");
        retryJobs.hidden = false;
    } finally {
        if (version === jobsRequestVersion) jobsList.setAttribute("aria-busy", "false");
    }
}

// Event Listeners
if (searchForm) {
    searchForm.addEventListener("submit", (event) => {
        event.preventDefault();
        applyFilters();
    });
}

if (applyFiltersBtn) {
    applyFiltersBtn.addEventListener("click", () => {
        applyFilters();
    });
}

if (clearFiltersBtn) {
    clearFiltersBtn.addEventListener("click", () => {
        clearFilters();
    });
}

retryJobs.addEventListener("click", () => loadJobs(lastJobsQuery));

loadJobs();
