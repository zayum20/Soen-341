# Sprint 2 Contribution Log — Ariane Elfy Madjofo Sofouet

**Project:** CareerConnect  
**GitHub username:** Mesa237  
**Time reporting:** Retrospective estimates; exact time was not tracked.  

**Estimated time:** UI redesign & branding: **3 hours**. Profile & avatar management: **4 hours**. Resume upload & inline preview: **4 hours**. AI Resume Builder integration: **4 hours**. Database stability & navigation: **2.5 hours**. Team meetings: **3–4 hours**. Total: **approximately 17.5–21.5 hours**.

---

### Summary of Contributions
- **UI Design & Branding:** Changed the complete platform UI design from blue to purple (`#7222ac`), including buttons, tags, focus states, and the CareerConnect logo.
- **Profile Photo & Management:** Implemented the front end and back end for profile picture upload/removal using `multer` with dropdown camera controls and default avatar fallback.
- **Resume Upload & Inline Preview:** Built the full front end, back end, and database schema (`resume_path`) for resume upload and deletion, with embedded iframe preview for PDF documents.
- **AI Resume Builder:** Developed an AI resume builder with Claude, merged its front end and back end into the main project, matched its styling to the `#7222ac` theme, and linked it via dedicated buttons in the user profile.
- **Database & Stability:** Resolved MySQL connection crashes by adding `dotenv` and fallback credentials, ensured the `resumes` table auto-creates, and updated dashboard navigation.

---

### Detailed Breakdown

| Date / work period | Activity | Detailed contribution and outcome | Time (hours) | Supporting evidence |
| --- | --- | --- | --- | --- |
| **Oct 7–10, 2026** | **UI Theme Redesign & Branding** | Updated the entire platform UI theme from blue (`#2563eb`) to purple (`#7222ac`), updating buttons, navigation highlights, tags, and form controls across CSS files. Generated and updated the CareerConnect logo to match the purple branding. | **3** | [Commit 019f294](https://github.com/zayum20/Soen-341/commit/019f294), [PR #31](https://github.com/zayum20/Soen-341/pull/31), [AI Log Tasks 2.1 & 2.2](../AI_Log/Elfy/.gitkeep) |
| **Oct 10–16, 2026** | **Profile Photo Upload & Management** | Implemented profile picture upload and deletion for job seekers and employers using `multer` with storage in `public/uploads/`. Created the camera button dropdown menu (`#avatar-menu`) with "Upload Photo" and "Remove Photo" actions, with automatic fallback to `default.png`. Added backend endpoints `/api/profile/upload-avatar` and delete handling. | **4** | [Commit 88dc810](https://github.com/zayum20/Soen-341/commit/88dc810), [PR #33](https://github.com/zayum20/Soen-341/pull/33) |
| **Oct 11–16, 2026** | **Resume Upload & Inline Document Preview** | Implemented resume upload functionality for PDF/DOCX files preserving extensions. Added `resume_path` storage in MySQL (`job_seeker_profiles`). Built the embedded `<iframe>` preview on the profile page and the "Remove Resume" action (`DELETE /api/profile/resume`). | **4** | [Commit 88dc810](https://github.com/zayum20/Soen-341/commit/88dc810), [PR #33](https://github.com/zayum20/Soen-341/pull/33), [AI Log Task 2.3](../AI_Log/Elfy/.gitkeep) |
| **Oct 20–25, 2026** | **AI Resume Builder Integration** | Integrated the AI Resume Builder frontend (`public/resume-builder/`). Replaced the raw file input with two prominent buttons under the Resume section: "Upload Current Resume" (triggers file picker directly) and "Create a New Resume" (links to builder). Restyled builder buttons to match `#7222ac`. Removed redundant upload controls. | **4** | [Commit fbcc795](https://github.com/zayum20/Soen-341/commit/fbcc795), [Commit 6f84200](https://github.com/zayum20/Soen-341/commit/6f84200), [PR #67](https://github.com/zayum20/Soen-341/pull/67) |
| **Oct 25–26, 2026** | **Database Stability & Navigation Updates** | Resolved MySQL connection failures (`ER_ACCESS_DENIED_ERROR`) by adding `dotenv` and fallback credentials (`root` / `""`) to `server.js` and `db.js`. Added auto-creation for the `resumes` table. Added the "Settings" link to the job seeker dashboard navigation and favicon to the employer dashboard. | **2.5** | [Commit 3fe2136](https://github.com/zayum20/Soen-341/commit/3fe2136), [PR #76](https://github.com/zayum20/Soen-341/pull/76), [PR #78](https://github.com/zayum20/Soen-341/pull/78) |
| **Oct 8–25, 2026** | **AI Documentation & Team Meetings** | Attended Sprint 2 team meetings (Oct 8, Oct 16, Oct 22). Documented all AI prompts, validation steps, decisions, and reflections in `AI_Log/Elfy/.gitkeep`. | **3–4** (meetings) | [AI usage log](../AI_Log/Elfy/.gitkeep), [Sprint 2 Minutes](../minutes/sprint-2/meeting-minutes.md) |
| **Total** | | | **~17.5–21.5 (including meetings)** | |
