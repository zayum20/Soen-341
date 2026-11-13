const assert = require("node:assert/strict");
const test = require("node:test");
const {
    APPLICATION_STATUSES,
    SEEKER_LIST_SQL,
    SEEKER_DETAIL_SQL,
    EMPLOYER_LIST_SQL,
    authorizeSeeker,
    applicationInsert,
    presentEmployerApplication,
    presentSeekerApplication,
    selectVisibleApplications,
    selectVisibleApplication,
    canDownloadSubmittedResume,
    summarizeApplications
} = require("../server/application-metrics");

const NOW = new Date("2026-11-11T15:00:00.000Z");

function application(overrides) {
    return {
        id: 1,
        job_seeker_id: 7,
        status: "Applied",
        applied_at: "2026-11-11T12:00:00.000Z",
        title: "Analyst",
        company_name: "Northwind",
        ...overrides
    };
}

test("application insert keeps the submitted resume file name", () => {
    const insert = applicationInsert(4, 7, "Hello", {
        file: "1000-aaaa.pdf",
        originalName: "resume-a.pdf"
    });

    assert.match(insert.sql, /submitted_resume_file/);
    assert.deepEqual(insert.params, [4, 7, "Hello", "1000-aaaa.pdf", "resume-a.pdf", 4]);
});

test("an application without a resume inserts null resume columns", () => {
    const insert = applicationInsert(4, 7, "", { file: null, originalName: null });

    assert.equal(insert.params[2], null);
    assert.equal(insert.params[3], null);
    assert.equal(insert.params[4], null);
    assert.equal(presentSeekerApplication({
        id: 9,
        status: "Applied",
        has_submitted_resume: 0
    }).has_submitted_resume, false);
});

test("seeker history queries are limited to the logged-in seeker", () => {
    assert.match(SEEKER_LIST_SQL, /applications\.job_seeker_id = \?/);
    assert.match(SEEKER_DETAIL_SQL, /applications\.id = \?/);
    assert.match(SEEKER_DETAIL_SQL, /applications\.job_seeker_id = \?/);
});

test("a seeker cannot view another seeker's applications", () => {
    const rows = [
        application({ id: 1, job_seeker_id: 7, title: "Mine" }),
        application({ id: 2, job_seeker_id: 8, title: "Theirs" })
    ];
    const visible = selectVisibleApplications({ userId: 7, role: "job_seeker" }, rows);

    assert.equal(visible.error, null);
    assert.deepEqual(visible.applications.map((item) => item.title), ["Mine"]);
    assert.equal(visible.applications[0].job_seeker_id, undefined);

    const hidden = selectVisibleApplication(
        { userId: 7, role: "job_seeker" },
        application({ id: 2, job_seeker_id: 8 })
    );
    assert.equal(hidden.error.status, 404);

    const employer = selectVisibleApplications({ userId: 3, role: "employer" }, rows);
    assert.equal(employer.error.status, 403);
    assert.deepEqual(employer.applications, []);

    assert.equal(authorizeSeeker(null).status, 401);
});

test("recruiters cannot download another company's submitted resume", () => {
    const denied = canDownloadSubmittedResume(
        { userId: 3, role: "employer" },
        { employer_id: 9, submitted_resume_file: "1000-aaaa.pdf" },
        "employer"
    );
    const allowed = canDownloadSubmittedResume(
        { userId: 9, role: "employer" },
        { employer_id: 9, submitted_resume_file: "1000-aaaa.pdf" },
        "employer"
    );

    assert.equal(denied.status, 404);
    assert.equal(allowed, null);
});

test("employer responses do not include the private resume file name", () => {
    const presented = presentEmployerApplication({
        id: 5,
        status: "Interview",
        submitted_resume_file: "private.pdf",
        submitted_resume_original_name: "resume-a.pdf",
        has_submitted_resume: 1,
        job_title: "Analyst"
    });

    assert.equal(presented.has_submitted_resume, true);
    assert.equal(presented.submitted_resume_original_name, "resume-a.pdf");
    assert.equal(Object.hasOwn(presented, "submitted_resume_file"), false);
    assert.equal(EMPLOYER_LIST_SQL.includes("AS has_submitted_resume"), true);
});

test("known application statuses stay unchanged", () => {
    APPLICATION_STATUSES.forEach((status) => {
        assert.equal(presentSeekerApplication(application({ status })).status, status);
    });

    const summary = summarizeApplications([
        application({ status: "Applied" }),
        application({ status: "Applied" }),
        application({ status: "Interview" }),
        application({ status: "Rejected" }),
        application({ status: "Pending" })
    ], NOW);

    assert.equal(summary.total, 5);
    assert.equal(summary.byStatus.Applied, 2);
    assert.equal(summary.byStatus["Under Review"], 0);
    assert.equal(summary.byStatus.Interview, 1);
    assert.equal(summary.byStatus.Offered, 0);
    assert.equal(summary.byStatus.Rejected, 1);
    assert.equal(summary.otherStatusCount, 1);
});

test("weekly counts use Monday-Sunday UTC weeks and the submission date", () => {
    const summary = summarizeApplications([
        application({ applied_at: "2026-11-09T00:00:00.000Z" }),
        application({ applied_at: "2026-11-08T23:59:59.000Z" }),
        application({ applied_at: "2026-09-21T00:00:00.000Z" }),
        application({ applied_at: "2026-09-20T23:59:59.000Z" })
    ], NOW);

    assert.equal(summary.weeks.length, 8);
    assert.equal(summary.weeks[0].weekStart, "2026-09-21");
    assert.equal(summary.weeks[0].weekEnd, "2026-09-27");
    assert.equal(summary.weeks[0].count, 1);
    assert.equal(summary.weeks[6].weekStart, "2026-11-02");
    assert.equal(summary.weeks[6].count, 1);
    assert.equal(summary.weeks[7].weekStart, "2026-11-09");
    assert.equal(summary.weeks[7].weekEnd, "2026-11-15");
    assert.equal(summary.weeks[7].count, 1);
    assert.equal(summary.applicationsOutsideWeekRange, 1);
    assert.match(summary.weekDefinition, /Monday 00:00:00.000 UTC/);
});

test("empty application history returns zero counts for every status and week", () => {
    const summary = summarizeApplications([], NOW);

    assert.equal(summary.total, 0);
    assert.deepEqual(summary.byStatus, {
        Applied: 0,
        "Under Review": 0,
        Interview: 0,
        Offered: 0,
        Rejected: 0
    });
    assert.equal(summary.weeks.length, 8);
    assert.equal(summary.weeks.every((week) => week.count === 0), true);
    assert.equal(summary.applicationsOutsideWeekRange, 0);
});
