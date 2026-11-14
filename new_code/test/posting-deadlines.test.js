const test = require("node:test");
const assert = require("node:assert/strict");
const { parseDeadline } = require("../server/posting-deadlines");
const before = new Date("2026-01-01T00:00:00Z");
test("blank deadline means no closing time", () => {
    for (const value of [undefined, null, ""]) assert.equal(parseDeadline(value, before), null);
});
test("winter deadline closes next midnight Toronto (UTC-5)", () => {
    assert.equal(parseDeadline("2026-11-13", before), "2026-11-14 05:00:00");
});
test("summer deadline closes next midnight Toronto (UTC-4)", () => {
    assert.equal(parseDeadline("2026-07-01", before), "2026-07-02 04:00:00");
});
test("daylight-saving transition dates use the offset at closing time", () => {
    assert.equal(parseDeadline("2026-03-08", before), "2026-03-09 04:00:00");
    assert.equal(parseDeadline("2026-11-01", before), "2026-11-02 05:00:00");
});
test("deadline stays available through its final Toronto millisecond", () => {
    assert.equal(parseDeadline("2026-11-13", new Date("2026-11-14T04:59:59.999Z")), "2026-11-14 05:00:00");
    assert.throws(() => parseDeadline("2026-11-13", new Date("2026-11-14T05:00:00Z")));
});
test("invalid, impossible, and expired dates are rejected", () => {
    for (const value of [42, {}, "2026-02-30", "2026-13-01", "13/11/2026", "0000-01-01", "2025-12-01"]) {
        assert.throws(() => parseDeadline(value, before));
    }
});
