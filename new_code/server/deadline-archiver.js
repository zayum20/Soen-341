// One SQL update preserves jobs/applications and never touches jobs with no deadline.
// The database clock is used for comparisons because deadline_at stores UTC.
const ARCHIVE_EXPIRED_SQL = `UPDATE jobs SET archived_at = CURRENT_TIMESTAMP
    WHERE archived_at IS NULL AND deadline_at IS NOT NULL
        AND deadline_at <= UTC_TIMESTAMP()`;
function archiveExpiredPostings(db) {
    return new Promise((resolve, reject) => {
        db.query(ARCHIVE_EXPIRED_SQL, (error, result) => {
            if (error) reject(error);
            else resolve(result.affectedRows);
        });
    });
}
function startDeadlineArchiver(db, { intervalMs = 60000, onError = console.error } = {}) {
    let running = false;
    async function sweep() {
        // Slow database requests must not cause overlapping minute checks.
        if (running) return;
        running = true;
        try { await archiveExpiredPostings(db); }
        catch (error) { onError("Deadline archiving failed; the next check will retry.", error); }
        finally { running = false; }
    }
    // Catch up after downtime, then archive newly expired postings every minute.
    sweep();
    const timer = setInterval(sweep, intervalMs);
    timer.unref();
    return () => clearInterval(timer);
}
module.exports = { ARCHIVE_EXPIRED_SQL, archiveExpiredPostings, startDeadlineArchiver };
