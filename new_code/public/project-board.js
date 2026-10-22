const COLUMN_IDS = {
    Backlog: "backlog",
    Ready: "ready",
    "In Progress": "in-progress"
};

const DEMO_ITEMS = [
    {
        id: "us-09",
        title: "US-09 Saved Jobs / Favorites",
        type: "User Story",
        assignee: "Unassigned",
        status: "Backlog",
        description: "Let job seekers save and revisit postings without searching again."
    },
    {
        id: "us-12",
        title: "US-12 Deadline notifications",
        type: "User Story",
        assignee: "Unassigned",
        status: "Backlog",
        description: "Reminders for upcoming application deadlines."
    },
    {
        id: "us-13",
        title: "US-13 Community Posts",
        type: "User Story",
        assignee: "Unassigned",
        status: "Backlog",
        description: "Feed for networking events, hackathons, and workshops."
    },
    {
        id: "us-08",
        title: "US-08 Application status tracking",
        type: "User Story",
        assignee: "Sara",
        status: "Ready",
        description: "Show Applied / Interview / Offered / Rejected on the seeker dashboard."
    },
    {
        id: "task-5.2",
        title: "Build create/edit job posting form",
        type: "Task",
        assignee: "Ayza",
        status: "Ready",
        description: "Definition of Ready met in sprint planning; ready to start."
    },
    {
        id: "us-05",
        title: "US-05 Job posting management",
        type: "User Story",
        assignee: "Sara",
        status: "In Progress",
        description: "Recruiters create, edit, and close postings."
    },
    {
        id: "us-07",
        title: "US-07 Job application submission",
        type: "User Story",
        assignee: "Minatta",
        status: "In Progress",
        description: "Apply with saved profile and resume; block duplicates."
    },
    {
        id: "us-03",
        title: "US-03 Profile management",
        type: "User Story",
        assignee: "Elfy",
        status: "In Progress",
        description: "Job seekers edit skills, education, and experience."
    }
];

function cardHtml(item) {
    return `
        <article class="board-card" data-id="${escapeHtml(item.id)}">
            <h3>${escapeHtml(item.title)}</h3>
            <p class="card-meta">${escapeHtml(item.assignee || "Unassigned")}</p>
            <p class="card-desc">${escapeHtml(item.description || "")}</p>
            <div class="card-tags">
                <span class="card-tag">${escapeHtml(item.type || "Item")}</span>
                <span class="card-tag">${escapeHtml(item.id)}</span>
            </div>
        </article>
    `;
}

function renderBoard(items) {
    const grouped = {
        Backlog: [],
        Ready: [],
        "In Progress": []
    };

    for (const item of items) {
        if (grouped[item.status]) {
            grouped[item.status].push(item);
        }
    }

    for (const [status, slug] of Object.entries(COLUMN_IDS)) {
        const container = document.getElementById(`cards-${slug}`);
        const count = document.getElementById(`count-${slug}`);
        const cards = grouped[status];

        count.textContent = String(cards.length);

        if (cards.length === 0) {
            container.innerHTML = `<p class="column-empty">No items yet.</p>`;
        } else {
            container.innerHTML = cards.map(cardHtml).join("");
        }
    }
}

async function loadBoard() {
    const message = document.getElementById("board-message");

    try {
        const response = await fetch("/api/project-board");
        if (!response.ok) {
            throw new Error("Board API unavailable");
        }

        const data = await response.json();
        const items = Array.isArray(data.items) ? data.items : [];
        renderBoard(items.length ? items : DEMO_ITEMS);
    } catch (error) {
        console.warn("Using local demo project board data:", error);
        renderBoard(DEMO_ITEMS);
        if (message) {
            message.hidden = false;
            message.textContent = "Showing demo board data (API unavailable).";
        }
    }
}

loadBoard();
