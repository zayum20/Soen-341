// The server returns next-day Toronto midnight as a UTC timestamp. Subtract one
// millisecond to recover the recruiter's selected final application date.
function deadlineInputValue(timestamp) {
    if (!timestamp) return "";
    const date = new Date(new Date(timestamp).getTime() - 1);
    if (Number.isNaN(date.getTime())) return "";
    const parts = Object.fromEntries(new Intl.DateTimeFormat("en-CA", {
        timeZone: "America/Toronto", year: "numeric", month: "2-digit", day: "2-digit"
    }).formatToParts(date).map(part => [part.type, part.value]));
    return `${parts.year}-${parts.month}-${parts.day}`;
}
function deadlineLabel(timestamp) {
    const date = deadlineInputValue(timestamp);
    return date ? `Applications close ${date} at 11:59 p.m. Toronto time` : "No application deadline";
}
