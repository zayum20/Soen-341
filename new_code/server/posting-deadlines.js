// Store the first unavailable instant in UTC; the selected date stays open through
// its final millisecond in Toronto, including daylight-saving changes.
const ZONE = "America/Toronto";
function torontoParts(date) {
    return Object.fromEntries(new Intl.DateTimeFormat("en-CA", {
        timeZone: ZONE, year: "numeric", month: "2-digit", day: "2-digit",
        hour: "2-digit", minute: "2-digit", second: "2-digit", hourCycle: "h23"
    }).formatToParts(date).filter(p => p.type !== "literal").map(p => [p.type, Number(p.value)]));
}
function parseDeadline(value, now = new Date()) {
    if (value === undefined || value === null || value === "") return null;
    if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) throw new Error("Use a deadline date in YYYY-MM-DD format, or leave it blank.");
    const date = new Date(value + "T00:00:00Z");
    if (!Number.isFinite(date.getTime()) || date.toISOString().slice(0, 10) !== value || Number(value.slice(0, 4)) < 1000) throw new Error("Invalid deadline date.");
    const next = date.getTime() + 86400000;
    let instant = next;
    // Convert next-day Toronto midnight to UTC without relying on MySQL timezone tables.
    for (let i = 0; i < 3; i++) {
        const p = torontoParts(new Date(instant));
        instant += next - Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute, p.second);
    }
    if (instant <= now.getTime()) throw new Error("The application deadline must be today or a future date in Toronto.");
    return new Date(instant).toISOString().slice(0, 19).replace("T", " ");
}
module.exports = { parseDeadline };
