# Sara — Sprint 3 posting management validation

Validation date: November 12, 2026. Environment: local CareerConnect app and local MySQL database.

## Implemented behavior

Recruiters can create and edit postings. Only the posting owner can edit or archive a posting. Archiving marks the posting without deleting it or its applications. Archived postings are excluded from seeker search and reject new applications. Recruiter dashboards retain all owned postings and show separate active and archived counts. Dashboard links open applicants scoped to a posting and retain the existing status filter.

## Recorded checks

| Check | Result | Evidence / limits |
| --- | --- | --- |
| Edit form loads existing fields | Pass — live | Title, company, location, category, job type, and description loaded from the sample posting. |
| Save edit and refresh | Pass — live | Sample title changed to TEST – Dashboard Demo (Edited) and remained after refresh. |
| Cancel unsaved edit | Pass — live | Form reset and posting retained its saved title. |
| Archive and refresh | Pass — live | Sample displayed Archived after refresh; repeat archive button was disabled. |
| Archived posting excluded from search | Pass — endpoint | Local GET /api/jobs returned only the two active postings. Seeker browser walkthrough remains pending. |
| Existing applicants remain accessible | Pass — live | Archived posting's applicant remained visible in Applicants and from its dashboard link. |
| Posting-specific applicant/status filtering | Pass — live | job_id=3 showed its Applied applicant; Interview returned no matches instead of the other posting's Interview applicant. |
| Dashboard counts and labels | Pass — live | 3 total postings, 2 active, 1 archived, 2 applications; recent cards displayed availability. |
| Another recruiter cannot edit/archive | Pass — automated and live API | A separate fictional employer account could not list posting #3. Its edit and archive requests each returned HTTP 404 (Posting not found). A before/after database comparison confirmed every posting field, owner, and archive date was unchanged. |
| Archived posting rejects applications | Pass — automated and live API | After archiving sample #4, a stale-page submission request returned HTTP 409 with an archived-posting message. |
| New posting creation | Pass — live API | Fictional employer created posting #4; a subsequent employer-list request returned its saved title. |
| Unit/API suite | Pass | 48 tests passed after integrating applicant navigation: 27 Jest tests and 21 Node tests. |
| GitHub CI | Pass — user screenshot | PR #85 showed the CareerConnect CI check passing and no conflicts after the user pushed the merge resolution. |
| Final PR merge | Pending | User handles GitHub actions; do not mark merged without verification. |

## Database setup verified locally

Migration 002 added the missing submitted-resume columns. Migration 003 added jobs.archived_at. Before applying these migrations, a local database backup was saved outside the repository. All 3 postings and 2 applications remained afterward. Migration 003 was also exercised against sample tables in a separate temporary database. Teammates must apply required migrations to their own databases; GitHub does not share local data.

## Second-recruiter permission demonstration

1. Keep the owner posting ID and its original title/archive state as the reference.
2. Use a second fictional employer account. Its dashboard should not list the owner's posting.
3. With that second account's session, submit edit and archive requests targeting the owner's posting ID through a local API client or browser developer tools. UI absence alone does not prove server authorization.
4. Expect 404 for each non-owned target. Verify through the owner account that the title and archive state are unchanged.
5. Repeat without a session and expect 401; a seeker session should receive 403.
6. Record actual responses and mark the live permission check passed only after execution.

Do not include passwords, session cookies, real resumes, or database backups in this record or commits.

## Fresh creation and seeker archive checks

A separate fictional employer created posting #4, and a fictional seeker found it in search and applied. The owner then archived it. A new search request excluded it, another application submission returned HTTP 409 identifying the posting as archived, and the existing application remained in seeker history. These were real local API calls, not a seeker browser walkthrough. The sample posting, fictional accounts, and application remain locally for review; no cleanup or GitHub changes were performed.
