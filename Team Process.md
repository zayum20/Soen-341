# CareerConnect — Team Process Definition

**Course:** SOEN 341 — Fall 2026
**Team Size:** 6
**Document Owner:** Ayza

This document defines how the CareerConnect team plans, develops, reviews, documents, and completes work throughout the project.

---

## 1. Team Roles — Sprint 1

| Member       | Sprint 1 Responsibilities                                |
| ------------ | -------------------------------------------------------- |
| **Ayza**     | GitHub Setup and Initialization, Team Process Definition |
| **Tasneem**  | README File                                              |
| **Sara**     | Sprint Planning, Meeting Minutes                         |
| **Angelina** | User Stories and Task Breakdown, AI Usage Log            |
| **Elfy**     | User Profile Management                                  |
| **Minatta**  | Code Demonstration                                       |

Team members may collaborate on tasks when needed, but the assigned member is responsible for coordinating and completing their designated Sprint 1 responsibilities.

---

## 2. Workflow

Work moves through the following stages on the GitHub Project board:

```text
Backlog → Ready → In Progress → In Review → Done
```

### 2.1 Backlog

* User stories and tasks are created as GitHub Issues.
* Each issue should contain a clear description and acceptance criteria.
* Angelina coordinates the creation and organization of user stories and task breakdowns for Sprint 1.
* The project will maintain the required **15 user stories** and track them through the GitHub Project board.

### 2.2 Ready

An issue is moved to **Ready** when it meets the Definition of Ready and has been discussed and prioritized during Sprint Planning.

Sara coordinates Sprint Planning.

### 2.3 In Progress

Once work begins:

1. The assigned team member moves the issue to **In Progress**.
2. The team member creates a feature, bugfix, or documentation branch.
3. Work is completed on the branch rather than directly on `main`.

### 2.4 In Review

When the work is ready:

1. The team member pushes the branch to GitHub.
2. A Pull Request (PR) is opened targeting `main`.
3. At least one teammate reviews the PR.
4. The linked issue is moved to **In Review**.
5. The author addresses review comments.

### 2.5 Done

An issue is moved to **Done** when:

* The PR has been approved.
* The PR has been merged into `main`.
* The linked GitHub Issue has been closed.
* The Definition of Done has been satisfied.

---

## 3. Day-to-Day Development Process

Team members should follow this process when working on an assigned issue:

1. Select an assigned issue from the GitHub Project board with status **Ready**.
2. Move the issue to **In Progress**.
3. Create a branch from the latest `main`.
4. Work on the assigned task.
5. Commit changes frequently using clear commit messages.
6. Push the branch to GitHub.
7. Open a Pull Request targeting `main`.
8. Request at least one teammate to review the PR.
9. Address review comments and make any necessary changes.
10. After approval, merge the PR into `main`.
11. Close the linked issue and move it to **Done**.
12. Delete the branch after the PR has been merged.

---

## 4. Branching Strategy

The team will use a **simplified GitHub Flow**.

| Branch Type | Name Pattern                        | Purpose                    |
| ----------- | ----------------------------------- | -------------------------- |
| **Main**    | `main`                              | Stable, integrated code    |
| **Feature** | `feature/<issue-number>-short-name` | New functionality          |
| **Bugfix**  | `bugfix/<issue-number>-short-name`  | Bug fixes                  |
| **Docs**    | `docs/<short-name>`                 | Documentation-only changes |

### Examples

```text
feature/12-user-registration
feature/15-resume-upload
bugfix/18-login-validation
docs/team-process
```

### Branch Rules

* `main` is the stable branch.
* Direct pushes to `main` are not permitted.
* All changes should be submitted through a Pull Request.
* Branches should be short-lived and focused on one issue or task.
* Branches should be deleted after their PR is merged.
* Before opening or merging a PR, the author should make sure their branch is up to date with `main` using the team's agreed Git method (merge or rebase).

---

## 5. Pull Request (PR) Process

When a task is ready for review:

1. Push the working branch to GitHub.
2. Open a Pull Request targeting `main`.
3. Link the PR to the relevant GitHub Issue using the issue number or closing keyword.
4. Complete the Pull Request template.
5. Request at least **one teammate** to review the PR.
6. Move the linked issue to **In Review**.
7. Address any requested changes.
8. After approval, a teammate should merge the PR into `main`.

### PR Template Requirements

Each PR should include:

* **What changed and why**
* **Related issue number** (for example, `Closes #12`)
* **How to test the changes**
* **Screenshots** for relevant UI changes
* **AI usage note** if AI was used
* Reference to the appropriate AI log entry when applicable

### Merge Rule

Team members should not normally merge their own Pull Requests.

Another teammate should merge the PR after approval. An exception may be made for situations such as a documentation-only hotfix during a lab when the TA is present and the team agrees.

---

## 6. Commit Message Guidelines

Commit messages should be short, clear, and written in the imperative form.

### Examples

```text
Add registration form validation
Fix login error message
Update user profile layout
Add resume upload API
```

When useful, include the related issue number:

```text
Implement signup API (#12)
```

Team members should avoid vague commit messages such as:

```text
changes
update
stuff
final
test
```

---

## 7. Code Review Process

### Reviewer Checklist

Before approving a Pull Request, the reviewer should verify:

* [ ] Code matches the linked user story or task
* [ ] Acceptance criteria have been addressed
* [ ] No obvious bugs or broken flows are present
* [ ] Naming and code structure are clear and consistent
* [ ] No passwords, API keys, or other secrets are committed
* [ ] UI changes are readable on desktop and mobile when applicable
* [ ] Tests or manual test steps are provided when relevant
* [ ] AI-generated code has been reviewed and understood by the author
* [ ] Documentation has been updated when necessary

### Review Norms

* Review requests should normally be addressed within **24–48 hours** during the sprint.
* Review comments should be constructive and specific.
* Reviewers should explain problems and suggest improvements when appropriate.
* Authors should address review comments or explain why a suggested change was not made.
* At least **one approving review** is required before merging.
* Two reviewers are preferred for important authentication or profile-related functionality when practical.

---

## 8. Definition of Ready (DoR)

A user story or task is considered **Ready** when:

* [ ] It is written as a clear GitHub Issue.
* [ ] Acceptance criteria are provided.
* [ ] It has a type label (`user-story` or `task`).
* [ ] It has a priority label (`priority:high`, `priority:medium`, or `priority:low`).
* [ ] It is assigned to a team member.
* [ ] Dependencies are identified or confirmed as none.
* [ ] Effort/size has been estimated during Sprint Planning.
* [ ] The team understands what needs to be completed.
* [ ] The expected outcome can be verified.

---

## 9. Definition of Done (DoD)

A user story or task is considered **Done** when:

* [ ] Implementation is complete.
* [ ] Acceptance criteria have been satisfied.
* [ ] Basic manual testing has been performed.
* [ ] Testing steps or results are documented in the PR when relevant.
* [ ] Code has been reviewed and approved.
* [ ] Code has been merged into `main` through an approved Pull Request.
* [ ] The linked GitHub Issue has been closed.
* [ ] The GitHub Project board status is **Done**.
* [ ] Documentation has been updated when necessary.
* [ ] If AI was used, the interaction has been documented in `AI_Log/<MemberName>/`.

---

## 10. Issue Labels

The following labels will be used to organize GitHub Issues:

| Label             | Purpose                                                 |
| ----------------- | ------------------------------------------------------- |
| `user-story`      | User story issues                                       |
| `task`            | Implementation or process tasks                         |
| `priority:high`   | Must be completed during the sprint                     |
| `priority:medium` | Important but flexible                                  |
| `priority:low`    | Nice to have                                            |
| `documentation`   | Documentation, README, process, or meeting-related work |
| `frontend`        | Front-end/UI work                                       |
| `backend`         | Back-end/server work                                    |
| `ai`              | AI-related features or AI documentation                 |
| `sprint-1`        | Sprint 1 scope                                          |

Labels should be applied consistently so that issues can be filtered and organized easily.

---

## 11. Repository Structure

The repository will follow the following structure:

```text
CareerConnect/
├── README.md
├── docs/
│   ├── TEAM_PROCESS.md
│   └── GITHUB_SETUP.md
├── minutes/
├── AI_Log/
│   ├── Ayza/
│   ├── Tasneem/
│   ├── Sara/
│   ├── Angelina/
│   ├── Elfy/
│   └── Minatta/
├── sprint_deliverables/
│   └── sprint1/
├── src/
└── .github/
    └── PULL_REQUEST_TEMPLATE.md
```

### Repository Responsibilities

* `README.md` — maintained by Tasneem
* `docs/TEAM_PROCESS.md` — maintained by Ayza
* `docs/GITHUB_SETUP.md` — maintained by Ayza
* `minutes/` — meeting minutes maintained by Sara
* `AI_Log/` — coordinated by Angelina; each member maintains their own folder
* `sprint_deliverables/` — Sprint deliverables
* `src/` — application source code
* `.github/PULL_REQUEST_TEMPLATE.md` — Pull Request template

---

## 12. AI Usage and Documentation

AI tools may be used for:

* Planning
* Brainstorming
* Coding
* Debugging
* Documentation
* Understanding technical concepts
* Reviewing or improving work

AI-generated output must not be accepted without validation by the team member using it.

### AI Log Requirement

Every AI-assisted activity must be documented in:

```text
AI_Log/<MemberName>/
```

Each member is responsible for maintaining their own AI usage records.

### Suggested AI Log Format

Each AI interaction should include:

```text
Date:
Member:
AI Tool:
Purpose:
Prompt / Summary:
AI Output Summary:
Action: Accepted / Modified / Rejected
Validation:
Related GitHub Issue/PR:
```

### AI Validation

The team member using AI is responsible for:

1. Reviewing the generated output.
2. Testing or verifying the output when applicable.
3. Understanding the code or content before using it.
4. Modifying the output when necessary.
5. Recording whether the output was **Accepted, Modified, or Rejected**.

Unverified AI-generated code should not be committed to the repository.

---

## 13. User Stories and Task Management

The project requires **15 user stories**.

User stories will be managed as GitHub Issues and tracked through the Project board.

Each user story should include:

* A clear user-focused description
* Acceptance criteria
* Priority
* Relevant labels
* Assignee
* Dependencies, if applicable
* Sprint assignment when appropriate

A typical user story should follow this format:

```text
As a [type of user],
I want [functionality],
so that [benefit/value].
```

The team will break larger user stories into smaller implementation tasks when necessary.

Angelina coordinates the user-story and task breakdown process, while the entire team participates in reviewing and refining the stories during Sprint Planning.

---

## 14. Communication and Meetings

### Team Meetings

Team meetings will be used to:

* Discuss progress
* Identify blockers
* Review upcoming work
* Assign responsibilities
* Make project decisions

Meeting attendance, decisions, and action items should be documented in the `minutes/` directory.

Sara is responsible for coordinating and maintaining meeting minutes.

### Weekly Lab Meetings

The team will attend weekly lab meetings with the TA.

Relevant attendance, discussions, feedback, and action items should be recorded in the meeting minutes.

### Blocking Issues

When a team member encounters a blocker:

1. Post the issue in the team communication channel.
2. Identify the related GitHub Issue when applicable.
3. Explain what has been attempted.
4. Ask the team for assistance if needed.
5. Update the GitHub Issue with relevant information.

### Process Changes

Changes to the team's development process should be made through a Pull Request that updates this document.

The team should be informed of significant process changes after they are approved.

---

## 15. Team Collaboration Principles

The team will follow these principles throughout development:

* Communicate blockers early.
* Keep GitHub Issues and Project statuses up to date.
* Keep commits and Pull Requests focused.
* Review teammates' work respectfully and constructively.
* Do not commit secrets or sensitive information.
* Test changes before requesting review.
* Keep documentation up to date.
* Ask for clarification when requirements are unclear.
* Ensure that each team member understands and can explain the work they submit.
* Use AI as a supporting tool rather than a replacement for understanding and validation.

---

## 16. Sprint 1 Completion Checklist

Before considering Sprint 1 complete, the team should verify:

* [ ] Required user stories have been created and organized.
* [ ] Required **15 user stories** are documented as GitHub Issues.
* [ ] Sprint 1 issues are assigned.
* [ ] GitHub Project board is updated.
* [ ] Required labels are created and applied.
* [ ] Branching conventions are being followed.
* [ ] Pull Requests are used for changes to `main`.
* [ ] Code reviews are completed where applicable.
* [ ] Sprint 1 deliverables are documented.
* [ ] Meeting minutes are up to date.
* [ ] AI usage is documented by each member when applicable.
* [ ] Repository documentation is up to date.
* [ ] Completed issues satisfy the Definition of Done.

---

**Document Owner:** Ayza
**Project:** CareerConnect
**Course:** SOEN 341 — Fall 2026

