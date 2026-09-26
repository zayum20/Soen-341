# Sprint 1 Plan

**Project:** CareerConnect — SOEN 341, Fall 2026  
**Coordinator:** Sara Azmoon (saraazzz)  
**Submission deadline:** September 28, 2026 (confirmed by Sara)  
**Planning record:** September 18–28, 2026; formal sprint start to be confirmed by the team.

## Sprint goal
Establish the development workflow and product backlog, then demonstrate two integrated basic features: registration/login and user profile management with MySQL persistence.

## Live tracker
- [Sprint 1 milestone](https://github.com/zayum20/Soen-341/milestone/1)
- [Sprint 1 issues](https://github.com/zayum20/Soen-341/issues?q=is%3Aissue+label%3Asprint-1)
- [All product and sprint issues](https://github.com/zayum20/Soen-341/issues)
- [Team process](Team%20Process.md)
- [Meeting records](Meeting%20minutes.md)

Issues are the live source of progress. This document summarizes the plan; update it after scope or scheduling decisions. Keep checkpoint issues open until their evidence is complete. A GitHub Project has not yet been linked to the repository; confirm the shared board with Ayza before introducing another board.

## Agreed stack and responsibilities
HTML, CSS, JavaScript frontend; Node.js backend; MySQL database; blue theme.

| Member | GitHub | Responsibility |
| --- | --- | --- |
| Ayza | zayum20 | Repository setup and team process |
| Tasneem | TasneemChowdhury | README |
| Sara | saraazzz | Sprint planning and meeting records |
| Angelina | aymontano1 | User stories, task breakdown, AI-log coordination |
| Elfy | Mesa237 | Profile management and frontend; authentication UI support |
| Minatta | amin4t4 | Authentication work reported in Meeting 2; code demonstration |

## Checkpoints
These are proposed planning targets based on the September 28 deadline. The September 25 setup/backlog targets are now past; review remaining work on September 26 rather than treating the targets as proof of completion.

| Issue | Checkpoint | Responsible member | Target | Priority | Status snapshot |
| --- | --- | --- | --- | --- | --- |
| [#2](https://github.com/zayum20/Soen-341/issues/2) | CP1 Setup and workflow | Ayza | Sep 25 | High | In Progress; verification pending |
| [#3](https://github.com/zayum20/Soen-341/issues/3) | CP2 Requirements and backlog | Angelina; Sara coordinates plan | Sep 25 | High | In Progress; five original stories pending |
| [#4](https://github.com/zayum20/Soen-341/issues/4) | CP3 Registration/login | Minatta; Elfy supports UI | Sep 26 | High | In Progress; end-to-end verification pending |
| [#5](https://github.com/zayum20/Soen-341/issues/5) | CP4 Profile management | Elfy | Sep 26 | High | In Progress; fixes/integration pending |
| [#6](https://github.com/zayum20/Soen-341/issues/6) | CP5 Integration | Minatta and Elfy | Sep 26 | High | Not Started; completion unverified |
| [#7](https://github.com/zayum20/Soen-341/issues/7) | CP6 Testing and review | Sara coordinates with Minatta and Elfy | Sep 27 | High | Not Started; results pending |
| [#8](https://github.com/zayum20/Soen-341/issues/8) | CP7 Documentation and submission | Sara coordinates; all members contribute | Sep 28 | High | Not Started; final review pending |

Each checkpoint is a **Task**, not a user story. Detailed completion criteria are in its issue. Documentation should be ready September 27, leaving September 28 for the final check and submission.

## Sprint implementation work plan
Statuses below reflect feature-level progress reported September 20; individual tasks still require owner verification. Estimates are Codex-proposed planning sizes, not team-approved commitments. Do not add story estimates to task estimates.

| Issue | Title | Type | Responsible member | Target | Priority | Status | Proposed effort |
| --- | --- | --- | --- | --- | --- | --- | --- |
| [#9](https://github.com/zayum20/Soen-341/issues/9) | US-01 Account registration | User Story | Minatta | Sep 26 | High | In Progress | See tasks |
| [#10](https://github.com/zayum20/Soen-341/issues/10) | US-02 Recruiter registration | User Story | Minatta | Sep 26 | High | In Progress | See shared tasks |
| [#11](https://github.com/zayum20/Soen-341/issues/11) | US-03 Profile management | User Story | Elfy | Sep 26 | High | In Progress | See tasks |
| [#19](https://github.com/zayum20/Soen-341/issues/19) | User/recruiter schema | Task | Minatta | Sep 26 | High | In Progress; verify | 2 points |
| [#20](https://github.com/zayum20/Soen-341/issues/20) | Signup API and roles | Task | Minatta | Sep 26 | High | In Progress; verify | 3 points |
| [#21](https://github.com/zayum20/Soen-341/issues/21) | Login/logout/protected access | Task | Minatta | Sep 26 | High | In Progress; verify | 3 points |
| [#22](https://github.com/zayum20/Soen-341/issues/22) | Registration/login UI | Task | Elfy | Sep 26 | High | In Progress; verify | 2 points |
| [#23](https://github.com/zayum20/Soen-341/issues/23) | Profile schema and API | Task | Elfy | Sep 26 | High | In Progress; verify | 3 points |
| [#24](https://github.com/zayum20/Soen-341/issues/24) | Profile UI and persistence | Task | Elfy | Sep 26 | High | In Progress; verify | 2 points |

Dependencies: #19 precedes #20; #20 and #21 support #22; #19's user-ID contract supports #23; #23 supports #24. Integration #6 depends on the authentication/profile tasks, followed by testing #7 and submission check #8.

## Product backlog and story origins
The ten existing stories in [User Stories](User%20Stories) originated with Claude, as documented by Angelina. Their issue versions preserve that origin. US-04 through US-10 are requirements for later implementation, not commitments to finish every feature in Sprint 1:

| Story | Issue | Feature |
| --- | --- | --- |
| US-04 | [#12](https://github.com/zayum20/Soen-341/issues/12) | Resume upload |
| US-05 | [#13](https://github.com/zayum20/Soen-341/issues/13) | Job posting management |
| US-06 | [#14](https://github.com/zayum20/Soen-341/issues/14) | Search and filtering |
| US-07 | [#15](https://github.com/zayum20/Soen-341/issues/15) | Application submission |
| US-08 | [#16](https://github.com/zayum20/Soen-341/issues/16) | Application status tracking |
| US-09 | [#17](https://github.com/zayum20/Soen-341/issues/17) | Saved jobs |
| US-10 | [#18](https://github.com/zayum20/Soen-341/issues/18) | AI-assisted resume feedback |

### Team-Generated User Stories and Features
Pending the team's own brainstorming and documentation. At least five additional original stories are needed to reach the minimum 15 user-story issues. Checkpoint and implementation-task issues do not count toward that minimum. Angelina coordinates this under #3. Do not label AI-generated ideas as team-generated. The full project must include a Generative AI feature and an additional original feature.

## Capacity and estimates
Six members are available in the team; their actual available hours for September 26–28 have not been supplied. Each member must record their hours and remaining task estimates before the plan is considered committed. The six implementation tasks total **15 proposed points**; this excludes process/documentation work and does not establish whether capacity is sufficient. Use 1/2/3/5 relative sizes, split oversized tasks, and estimate remaining effort after inspecting existing code.

| Member | Available hours Sep 26–28 | Remaining effort confirmation |
| --- | --- | --- |
| Ayza | To confirm | Setup/workflow verification |
| Tasneem | To confirm | README and setup verification |
| Sara | To confirm | Plan, minutes, testing coordination |
| Angelina | To confirm | Original stories, assignments, AI evidence |
| Elfy | To confirm | Frontend and profile work |
| Minatta | To confirm | Authentication and integration |

## Risks and responses
| Risk | Response | Owner |
| --- | --- | --- |
| Tight deadline and unknown remaining effort | Inspect existing work and confirm capacity immediately; prioritize two integrated features | Sara and feature owners |
| Missing original stories | Hold team brainstorming and record original ideas separately | Angelina and team |
| Git/merge conflicts | Follow short branches, peer review, and integration checks | Ayza, Minatta, Elfy |
| New languages or database integration | Agree API/schema contracts and test the full flow early | Minatta and Elfy |
| Miscommunication or stale statuses | Record blockers in issues and decisions in minutes | All members; Sara coordinates |
| Incomplete AI evidence | Each member prepares their own PDF with prompts/outputs, validation, decision, reflection | Each member; Angelina coordinates |

## Tracking rules and completion evidence
Follow the existing Team Process: Backlog → Ready → In Progress → In Review → Done. Use documentation branches and PRs into main; at least one teammate approves and another teammate merges. Do not close issues until the relevant acceptance criteria and Definition of Done are satisfied.

The existing sprint-1 label identifies current sprint work; enhancement identifies later feature backlog. Type and priority are recorded in issue bodies. The Team Process also calls for user-story/task and priority labels; these still need to be created/applied (the inspected Labels page did not expose a creation control). If a shared Project is linked, use Status, Assignees, Priority, Target date, Effort, and Checkpoint fields without duplicating the source issues.

## Submission checklist
- [ ] Minimum 15 genuine story issues, with AI and team origins separate.
- [ ] Assigned tasks, priorities, dates, confirmed estimates and capacity.
- [ ] Two basic features demonstrated with test evidence.
- [ ] README complete, including setup and accessible repository link.
- [ ] Meeting attendance confirmed and minutes reviewed.
- [ ] Each member's Sprint 1 PDF AI report and contribution evidence present.
- [ ] Submission document contains project title, six member names, README copy, and repository link.

## AI assistance and validation
Codex organized this plan, checkpoint/task issues, and meeting records using the supplied course document, existing user-story file, team process, and Sara's Discord notes. The 10 original AI stories retain their Claude provenance. Human review of dates, estimates, attendance, capacity, and statuses is pending; no code execution or feature completion is claimed. Sara should include this planning session's prompt/response or conversation link in her required Sprint 1 PDF AI report, with her actual validation, decision, and reflection.
