const APPLICATION_STATUSES = [
    "Applied",
    "Under Review",
    "Interview",
    "Offered",
    "Rejected"
];

const WEEK_COUNT = 8;
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const WEEK_DEFINITION = "ISO weeks in UTC. Each week begins Monday 00:00:00.000 UTC and ends Sunday 23:59:59.999 UTC. Counts use the application submission time in applications.applied_at. The range is the current week and the previous 7 weeks.";

const SEEKER_LIST_SQL = `
    SELECT
        applications.id,
        applications.job_seeker_id,
        applications.status,
        applications.cover_note,
        applications.applied_at,
        applications.updated_at,
        applications.submitted_resume_original_name,
        (applications.submitted_resume_file IS NOT NULL) AS has_submitted_resume,
        jobs.title,
        jobs.location,
        jobs.job_type,
        jobs.company AS company_name,
        employer_profiles.contact_name AS recruiter_name
    FROM applications
    JOIN jobs
        ON applications.job_id = jobs.id
    LEFT JOIN employer_profiles
        ON jobs.employer_id = employer_profiles.user_id
    WHERE applications.job_seeker_id = ?
    ORDER BY applications.applied_at DESC
`;

const SEEKER_DETAIL_SQL = `
    SELECT
        applications.id,
        applications.job_id,
        applications.job_seeker_id,
        applications.status,
        applications.cover_note,
        applications.applied_at,
        applications.updated_at,
        applications.submitted_resume_original_name,
        (applications.submitted_resume_file IS NOT NULL) AS has_submitted_resume,
        jobs.title,
        jobs.location,
        jobs.job_type,
        jobs.description,
        jobs.company AS company_name,
        employer_profiles.contact_name AS recruiter_name
    FROM applications
    JOIN jobs
        ON applications.job_id = jobs.id
    LEFT JOIN employer_profiles
        ON jobs.employer_id = employer_profiles.user_id
    WHERE applications.id = ?
        AND applications.job_seeker_id = ?
`;

const SEEKER_RESUME_SQL = `
    SELECT
        applications.id,
        applications.job_seeker_id,
        applications.submitted_resume_file,
        applications.submitted_resume_original_name
    FROM applications
    WHERE applications.id = ?
        AND applications.job_seeker_id = ?
`;

const EMPLOYER_LIST_SQL = `
    SELECT
        applications.id,
        applications.job_id,
        applications.status,
        applications.cover_note,
        applications.applied_at,
        applications.submitted_resume_original_name,
        (applications.submitted_resume_file IS NOT NULL) AS has_submitted_resume,
        jobs.title AS job_title,
        users.email,
        job_seeker_profiles.first_name,
        job_seeker_profiles.last_name
    FROM applications
    JOIN jobs
        ON applications.job_id = jobs.id
    JOIN users
        ON applications.job_seeker_id = users.id
    LEFT JOIN job_seeker_profiles
        ON users.id = job_seeker_profiles.user_id
    WHERE jobs.employer_id = ?
    ORDER BY applications.applied_at DESC
`;

const EMPLOYER_RESUME_SQL = `
    SELECT
        applications.id,
        applications.submitted_resume_file,
        applications.submitted_resume_original_name,
        jobs.employer_id
    FROM applications
    JOIN jobs
        ON applications.job_id = jobs.id
    WHERE applications.id = ?
        AND jobs.employer_id = ?
`;

function asBoolean(value) {
    if (Buffer.isBuffer(value)) {
        return value.length > 0 && value[0] !== 0;
    }

    return value === true || value === 1 || value === "1";
}

function authorizeSeeker(session) {
    if (!session || !session.userId) {
        return { status: 401, message: "Not logged in." };
    }

    if (session.role !== "job_seeker") {
        return { status: 403, message: "Only job seekers can view their applications." };
    }

    return null;
}

function authorizeEmployer(session) {
    if (!session || !session.userId) {
        return { status: 401, message: "Not logged in." };
    }

    if (session.role !== "employer") {
        return { status: 403, message: "Only employers can view applicants." };
    }

    return null;
}

function presentSeekerApplication(row) {
    const application = {
        id: row.id,
        status: row.status,
        cover_note: row.cover_note ?? null,
        applied_at: row.applied_at,
        updated_at: row.updated_at,
        title: row.title,
        location: row.location,
        job_type: row.job_type,
        company_name: row.company_name,
        recruiter_name: row.recruiter_name || null,
        submitted_resume_original_name: row.submitted_resume_original_name || null,
        has_submitted_resume: asBoolean(row.has_submitted_resume)
    };

    if (row.job_id != null) {
        application.job_id = row.job_id;
    }

    if (row.description != null) {
        application.description = row.description;
    }

    return application;
}

function presentEmployerApplication(row) {
    return {
        id: row.id,
        job_id: row.job_id,
        status: row.status,
        cover_note: row.cover_note ?? null,
        applied_at: row.applied_at,
        submitted_resume_original_name: row.submitted_resume_original_name || null,
        has_submitted_resume: asBoolean(row.has_submitted_resume),
        job_title: row.job_title,
        email: row.email,
        first_name: row.first_name,
        last_name: row.last_name
    };
}

function selectVisibleApplications(session, rows) {
    const denied = authorizeSeeker(session);

    if (denied) {
        return { error: denied, applications: [] };
    }

    const owned = rows.filter((row) => Number(row.job_seeker_id) === Number(session.userId));

    return {
        error: null,
        applications: owned.map(presentSeekerApplication)
    };
}

function selectVisibleApplication(session, row) {
    if (!row || Number(row.job_seeker_id) !== Number(session && session.userId)) {
        const denied = authorizeSeeker(session);

        if (denied) {
            return { error: denied, application: null };
        }

        return {
            error: { status: 404, message: "That application could not be found." },
            application: null
        };
    }

    return {
        error: null,
        application: presentSeekerApplication(row)
    };
}

function canDownloadSubmittedResume(session, row, audience) {
    if (audience === "employer") {
        const denied = authorizeEmployer(session);

        if (denied) {
            return denied;
        }

        if (!row || Number(row.employer_id) !== Number(session.userId)) {
            return { status: 404, message: "That application could not be found." };
        }
    } else {
        const visible = selectVisibleApplication(session, row);

        if (visible.error) {
            return visible.error;
        }
    }

    if (!row.submitted_resume_file) {
        return { status: 404, message: "No resume was submitted with this application." };
    }

    return null;
}

function applicationInsert(jobId, seekerId, coverNote, snapshot) {
    return {
        sql: `
            INSERT INTO applications (
                job_id,
                job_seeker_id,
                cover_note,
                submitted_resume_file,
                submitted_resume_original_name
            )
            VALUES (?, ?, ?, ?, ?)
        `,
        params: [
            jobId,
            seekerId,
            coverNote || null,
            snapshot && snapshot.file ? snapshot.file : null,
            snapshot && snapshot.originalName ? snapshot.originalName : null
        ]
    };
}

function utcIsoWeekStart(value) {
    const instant = new Date(value);

    if (Number.isNaN(instant.getTime())) {
        return null;
    }

    const start = new Date(Date.UTC(
        instant.getUTCFullYear(),
        instant.getUTCMonth(),
        instant.getUTCDate()
    ));
    const day = start.getUTCDay();
    const mondayOffset = day === 0 ? -6 : 1 - day;

    start.setUTCDate(start.getUTCDate() + mondayOffset);
    start.setUTCHours(0, 0, 0, 0);

    return start;
}

function addUtcDays(date, days) {
    const next = new Date(date.getTime());
    next.setUTCDate(next.getUTCDate() + days);
    return next;
}

function isoDate(date) {
    const month = String(date.getUTCMonth() + 1).padStart(2, "0");
    const day = String(date.getUTCDate()).padStart(2, "0");
    return `${date.getUTCFullYear()}-${month}-${day}`;
}

function formatUtcDate(date) {
    return `${MONTHS[date.getUTCMonth()]} ${date.getUTCDate()}, ${date.getUTCFullYear()}`;
}

function summarizeApplications(applications, now = new Date()) {
    const list = Array.isArray(applications) ? applications : [];
    const byStatus = {};

    APPLICATION_STATUSES.forEach((status) => {
        byStatus[status] = 0;
    });

    let otherStatusCount = 0;

    list.forEach((application) => {
        if (APPLICATION_STATUSES.includes(application.status)) {
            byStatus[application.status] += 1;
        } else {
            otherStatusCount += 1;
        }
    });

    const currentStart = utcIsoWeekStart(now);
    const weeks = [];

    for (let index = WEEK_COUNT - 1; index >= 0; index -= 1) {
        const weekStart = addUtcDays(currentStart, -7 * index);
        const nextWeek = addUtcDays(weekStart, 7);

        weeks.push({
            weekStart: isoDate(weekStart),
            weekEnd: isoDate(addUtcDays(weekStart, 6)),
            label: `${formatUtcDate(weekStart)} – ${formatUtcDate(addUtcDays(weekStart, 6))}`,
            count: 0,
            startMs: weekStart.getTime(),
            endMs: nextWeek.getTime()
        });
    }

    let applicationsOutsideWeekRange = 0;

    list.forEach((application) => {
        const applied = application.applied_at ? new Date(application.applied_at) : null;

        if (!applied || Number.isNaN(applied.getTime())) {
            applicationsOutsideWeekRange += 1;
            return;
        }

        const bucket = weeks.find((week) => applied.getTime() >= week.startMs && applied.getTime() < week.endMs);

        if (bucket) {
            bucket.count += 1;
        } else {
            applicationsOutsideWeekRange += 1;
        }
    });

    return {
        total: list.length,
        byStatus,
        otherStatusCount,
        weeks: weeks.map(({ weekStart, weekEnd, label, count }) => ({
            weekStart,
            weekEnd,
            label,
            count
        })),
        applicationsOutsideWeekRange,
        weekDefinition: WEEK_DEFINITION
    };
}

module.exports = {
    APPLICATION_STATUSES,
    WEEK_COUNT,
    WEEK_DEFINITION,
    SEEKER_LIST_SQL,
    SEEKER_DETAIL_SQL,
    SEEKER_RESUME_SQL,
    EMPLOYER_LIST_SQL,
    EMPLOYER_RESUME_SQL,
    authorizeSeeker,
    authorizeEmployer,
    presentSeekerApplication,
    presentEmployerApplication,
    selectVisibleApplications,
    selectVisibleApplication,
    canDownloadSubmittedResume,
    applicationInsert,
    summarizeApplications
};
