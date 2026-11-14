const { ARCHIVE_EXPIRED_SQL, archiveExpiredPostings, startDeadlineArchiver } = require("../server/deadline-archiver");
// A mocked database and clock exercise startup, repeated runs, and recovery safely.
afterEach(() => jest.useRealTimers());
test("archives only expired, not-yet-archived postings and never deletes records", async () => {
    const db = { query: jest.fn((sql, callback) => callback(null, { affectedRows: 2 })) };
    expect(await archiveExpiredPostings(db)).toBe(2);
    expect(ARCHIVE_EXPIRED_SQL).toContain("archived_at IS NULL AND deadline_at IS NOT NULL");
    expect(ARCHIVE_EXPIRED_SQL).toContain("deadline_at <= UTC_TIMESTAMP()");
    expect(ARCHIVE_EXPIRED_SQL).not.toMatch(/DELETE|applications/i);
});
test("starts immediately, checks every minute, and stops cleanly", async () => {
    jest.useFakeTimers();
    const db = { query: jest.fn((sql, callback) => callback(null, { affectedRows: 0 })) };
    const stop = startDeadlineArchiver(db);
    expect(db.query).toHaveBeenCalledTimes(1);
    await jest.advanceTimersByTimeAsync(60000);
    expect(db.query).toHaveBeenCalledTimes(2);
    stop();
    await jest.advanceTimersByTimeAsync(60000);
    expect(db.query).toHaveBeenCalledTimes(2);
});
test("retries after database failure", async () => {
    jest.useFakeTimers();
    const onError = jest.fn();
    const db = { query: jest.fn().mockImplementationOnce((sql, cb) => cb(new Error("offline")))
        .mockImplementation((sql, cb) => cb(null, { affectedRows: 0 })) };
    const stop = startDeadlineArchiver(db, { onError });
    await jest.advanceTimersByTimeAsync(60000);
    expect(onError).toHaveBeenCalledTimes(1);
    expect(db.query).toHaveBeenCalledTimes(2);
    stop();
});
test("does not overlap a slow database update", async () => {
    jest.useFakeTimers();
    const db = { query: jest.fn() };
    const stop = startDeadlineArchiver(db);
    await jest.advanceTimersByTimeAsync(180000);
    expect(db.query).toHaveBeenCalledTimes(1);
    stop();
});
