// Adds sample jobs and applications for the Sprint 3 dashboard demo.
// It does not create accounts or passwords. Register a job seeker and an
// employer in the website first, then pass their emails in the environment.

const mysql = require("mysql2/promise");

const SAMPLES = [
    { title: "Sprint 3 demo: Data Analyst", status: "Applied", weeksAgo: 0 },
    { title: "Sprint 3 demo: Support Specialist", status: "Interview", weeksAgo: 1 },
    { title: "Sprint 3 demo: QA Intern", status: "Under Review", weeksAgo: 3 },
    { title: "Sprint 3 demo: Project Coordinator", status: "Rejected", weeksAgo: 6 }
];

function utcMonday(now) {
    const start = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
    const day = start.getUTCDay();
    const mondayOffset = day === 0 ? -6 : 1 - day;
    start.setUTCDate(start.getUTCDate() + mondayOffset);
    start.setUTCHours(12, 0, 0, 0);
    return start;
}

function formatTimestamp(date) {
    const month = String(date.getUTCMonth() + 1).padStart(2, "0");
    const day = String(date.getUTCDate()).padStart(2, "0");
    return `${date.getUTCFullYear()}-${month}-${day} 12:00:00`;
}

async function main() {
    const seekerEmail = process.env.DEMO_SEEKER_EMAIL;
    const employerEmail = process.env.DEMO_EMPLOYER_EMAIL;

    if (!seekerEmail || !employerEmail) {
        console.error("Set DEMO_SEEKER_EMAIL and DEMO_EMPLOYER_EMAIL to accounts you already created.");
        console.error("This script does not create users or passwords.");
        process.exit(1);
    }

    const connection = await mysql.createConnection({
        host: process.env.DB_HOST || "localhost",
        port: Number(process.env.DB_PORT || 3306),
        user: process.env.DB_USER || "root",
        password: process.env.DB_PASSWORD || "",
        database: process.env.DB_NAME || "recruiting_website"
    });

    try {
        await connection.query("SET time_zone = '+00:00'");
        const [employers] = await connection.query(
            `SELECT users.id, employer_profiles.company_name
             FROM users
             LEFT JOIN employer_profiles ON employer_profiles.user_id = users.id
             WHERE users.email = ? AND users.role = 'employer'`,
            [employerEmail]
        );
        const [seekers] = await connection.query(
            "SELECT id FROM users WHERE email = ? AND role = 'job_seeker'",
            [seekerEmail]
        );

        if (!employers.length || !seekers.length) {
            console.error("Could not find both demo accounts. Register them in CareerConnect first.");
            process.exit(1);
        }

        const employerId = employers[0].id;
        const company = employers[0].company_name || "Demo Company";
        const seekerId = seekers[0].id;
        const monday = utcMonday(new Date());

        for (const sample of SAMPLES) {
            const [existingJobs] = await connection.query(
                "SELECT id FROM jobs WHERE employer_id = ? AND title = ?",
                [employerId, sample.title]
            );
            let jobId = existingJobs[0] && existingJobs[0].id;

            if (!jobId) {
                const [created] = await connection.query(
                    `INSERT INTO jobs (employer_id, title, company, location, category, job_type, description)
                     VALUES (?, ?, ?, 'Montreal, QC', 'Demo', 'Full-time', ?)`,
                    [employerId, sample.title, company, "Sample posting for the Sprint 3 dashboard demo."]
                );
                jobId = created.insertId;
            }

            const appliedAt = new Date(monday.getTime());
            appliedAt.setUTCDate(appliedAt.getUTCDate() - (sample.weeksAgo * 7));
            await connection.query(
                `INSERT INTO applications (
                    job_id, job_seeker_id, status, cover_note, applied_at,
                    submitted_resume_file, submitted_resume_original_name
                 )
                 VALUES (?, ?, ?, 'Sample application for the November 11 demo.', ?, NULL, NULL)
                 ON DUPLICATE KEY UPDATE status = VALUES(status), applied_at = VALUES(applied_at)`,
                [jobId, seekerId, sample.status, formatTimestamp(appliedAt)]
            );
            console.log(`${sample.title}: ${sample.status} on ${formatTimestamp(appliedAt)} UTC`);
        }
    } finally {
        await connection.end();
    }
}

main().catch((error) => {
    console.error(error.message);
    process.exit(1);
});
