const APPLICATION_STATUSES = [
    "Applied",
    "Under Review",
    "Interview",
    "Offered",
    "Rejected"
];

const hamburger = document.getElementById("hamburger");

if (hamburger) {
    hamburger.addEventListener("click", () => {
        const isCollapsed = document.body.classList.toggle("nav-collapsed");
        hamburger.setAttribute("aria-expanded", String(!isCollapsed));
    });
}

const logoutLink = document.getElementById("logout-link");

if (logoutLink) {
    logoutLink.addEventListener("click", async (event) => {
        event.preventDefault();

        try {
            const response = await fetch("/api/logout", {
                method: "POST"
            });
            const data = await response.json();

            if (response.ok) {
                alert("You have been logged out.");
                window.location.href = "login.html";
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error("Logout error:", error);
            alert("Could not connect to the server.");
        }
    });
}

function escapeHtml(value) {
    return String(value ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#39;");
}

function statusClass(status) {
    return "status-" + String(status).toLowerCase().replace(/\s+/g, "-");
}

function statusBadge(status) {
    return `<span class="status-badge ${statusClass(status)}">${escapeHtml(status)}</span>`;
}

function formatDate(value) {
    if (!value) {
        return "";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "";
    }

    return date.toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric"
    });
}

async function requireRole(expectedRole, wrongRolePage) {
    const response = await fetch("/api/profile");

    if (response.status === 401) {
        window.location.href = "login.html";
        return null;
    }

    if (!response.ok) {
        throw new Error("Could not check the current account.");
    }

    const profile = await response.json();

    if (profile.role !== expectedRole) {
        window.location.href = wrongRolePage;
        return null;
    }

    return profile;
}
