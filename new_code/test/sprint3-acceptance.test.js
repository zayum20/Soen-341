const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const test = require("node:test");
const { snapshotProfileResume } = require("../server/application-resumes");
const {
    applicationInsert,
    presentSeekerApplication,
    selectVisibleApplications,
    summarizeApplications
} = require("../server/application-metrics");

const NOW = new Date("2026-11-11T15:00:00.000Z");

test("US-07 acceptance: applying keeps Resume A after the profile resume becomes Resume B", () => {
    const sourceRoot = fs.mkdtempSync(path.join(os.tmpdir(), "careerconnect-source-"));
    const destinationRoot = fs.mkdtempSync(path.join(os.tmpdir(), "careerconnect-copies-"));
    fs.mkdirSync(path.join(sourceRoot, "uploads"));
    const profileResume = path.join(sourceRoot, "uploads", "resume-a.pdf");
    fs.writeFileSync(profileResume, "Resume A");

    const submitted = snapshotProfileResume({
        sourceRelativePath: "uploads/resume-a.pdf",
        sourceRoot,
        destinationRoot,
        now: 3000,
        randomHex: "resumea"
    });
    const insert = applicationInsert(12, 7, "I am interested.", submitted);

    fs.writeFileSync(profileResume, "Resume B");
    const replaced = snapshotProfileResume({
        sourceRelativePath: "uploads/resume-a.pdf",
        sourceRoot,
        destinationRoot,
        now: 4000,
        randomHex: "resumeb"
    });

    assert.equal(insert.params[3], "3000-resumea.pdf");
    assert.equal(insert.params[4], "resume-a.pdf");
    assert.equal(fs.readFileSync(path.join(destinationRoot, submitted.file), "utf8"), "Resume A");
    assert.equal(fs.readFileSync(path.join(destinationRoot, replaced.file), "utf8"), "Resume B");
});

test("US-08 acceptance: a seeker sees only their own application and its saved status", () => {
    const visible = selectVisibleApplications({ userId: 7, role: "job_seeker" }, [
        {
            id: 15,
            job_seeker_id: 7,
            status: "Interview",
            title: "Data Analyst",
            company_name: "Northwind",
            recruiter_name: "Mina Recruiter",
            applied_at: "2026-11-10T15:00:00.000Z",
            has_submitted_resume: 1,
            submitted_resume_original_name: "resume-a.pdf"
        },
        {
            id: 16,
            job_seeker_id: 8,
            status: "Rejected",
            title: "Someone else's job",
            company_name: "Other Co",
            applied_at: "2026-11-01T15:00:00.000Z"
        }
    ]);
    const shown = presentSeekerApplication(visible.applications[0]);

    assert.equal(visible.applications.length, 1);
    assert.equal(shown.title, "Data Analyst");
    assert.equal(shown.company_name, "Northwind");
    assert.equal(shown.recruiter_name, "Mina Recruiter");
    assert.equal(shown.status, "Interview");
    assert.equal(shown.has_submitted_resume, true);
    assert.equal(visible.applications.some((item) => item.title === "Someone else's job"), false);
});

test("US-08 acceptance: an older application without a resume remains visible", () => {
    const shown = presentSeekerApplication({
        id: 4,
        job_seeker_id: 7,
        status: "Applied",
        title: "Legacy role",
        company_name: "Archive Inc",
        applied_at: "2026-10-01T12:00:00.000Z",
        has_submitted_resume: null
    });

    assert.equal(shown.has_submitted_resume, false);
    assert.equal(shown.status, "Applied");
    assert.equal(shown.title, "Legacy role");
});

test("US-11 acceptance: analytics count only the signed-in seeker's applications by status and week", () => {
    const visible = selectVisibleApplications({ userId: 7, role: "job_seeker" }, [
        { id: 1, job_seeker_id: 7, status: "Applied", applied_at: "2026-11-11T12:00:00.000Z" },
        { id: 2, job_seeker_id: 7, status: "Interview", applied_at: "2026-11-04T12:00:00.000Z" },
        { id: 3, job_seeker_id: 7, status: "Rejected", applied_at: "2026-10-20T12:00:00.000Z" },
        { id: 4, job_seeker_id: 9, status: "Offered", applied_at: "2026-11-11T12:00:00.000Z" }
    ]);
    const summary = summarizeApplications(visible.applications, NOW);

    assert.equal(summary.total, 3);
    assert.equal(summary.byStatus.Applied, 1);
    assert.equal(summary.byStatus.Interview, 1);
    assert.equal(summary.byStatus.Rejected, 1);
    assert.equal(summary.byStatus.Offered, 0);
    assert.equal(summary.weeks.find((week) => week.weekStart === "2026-11-09").count, 1);
    assert.equal(summary.weeks.find((week) => week.weekStart === "2026-11-02").count, 1);
    assert.equal(summary.weeks.find((week) => week.weekStart === "2026-10-19").count, 1);
});

test("US-11 acceptance: a seeker with no applications gets an empty analytics dashboard", () => {
    const visible = selectVisibleApplications({ userId: 7, role: "job_seeker" }, []);
    const summary = summarizeApplications(visible.applications, NOW);

    assert.deepEqual(visible.applications, []);
    assert.equal(summary.total, 0);
    assert.equal(summary.weeks.every((week) => week.count === 0), true);
});
