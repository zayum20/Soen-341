
const hamburger = document.getElementById("hamburger");

if (hamburger) {
    hamburger.addEventListener("click", () => {
        const collapsed = document.body.classList.toggle("nav-collapsed");
        hamburger.setAttribute("aria-expanded", String(!collapsed));
    });
}

const pageMessage = document.getElementById("page-message");

function showMessage(elementId, message, isError = false) {
    const element = document.getElementById(elementId);
    element.textContent = message;
    element.className = `message ${isError ? "error" : "success"}`;
}

async function sendRequest(url, method, body) {
    const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Something went wrong.");
    }

    return data;
}

// Load the logged-in account and build its navigation.
async function loadSettingsPage() {
    try {
        const response = await fetch("/api/profile");

        if (response.status === 401) {
            window.location.href = "login.html";
            return;
        }

        if (!response.ok) {
            throw new Error("Could not load your account.");
        }

        const profile = await response.json();
        const links = document.getElementById("nav-links");

        const jobSeekerLinks = [
            ["Profile", "Profile.html", "person"],
            ["Jobs", "jobs.html", "briefcase"],
            ["My Applications", "my-applications.html", "clipboard-check"],
            ["Dashboard", "Profile.html", "house"]
        ];

        const employerLinks = [
            ["My Profile", "Employer_Profile.html", "person"],
            ["Dashboard", "Employer_Dashboard.html", "house"],
            ["Post a Job", "employer-post-job.html", "plus-circle"],
            ["Applicants", "employer-applicants.html", "people"]
        ];

        const navigation =
            profile.role === "employer" ? employerLinks : jobSeekerLinks;

        links.innerHTML = "";

        navigation.forEach(([label, href, icon]) => {
            const item = document.createElement("li");
            const link = document.createElement("a");
            const iconElement = document.createElement("i");
            const textElement = document.createElement("span");

            link.href = href;
            iconElement.className = `bi bi-${icon}`;
            textElement.textContent = label;

            link.append(iconElement, textElement);
            item.appendChild(link);
            links.appendChild(item);
        });

        const settingsItem = document.createElement("li");
        const settingsLink = document.createElement("a");
        settingsLink.href = "settings.html";
        settingsLink.className = "active";
        settingsLink.innerHTML =
            '<i class="bi bi-gear"></i><span>Settings</span>';
        settingsItem.appendChild(settingsLink);
        links.appendChild(settingsItem);

        const logoutItem = document.createElement("li");
        const logoutLink = document.createElement("a");
        logoutLink.href = "#";
        logoutLink.id = "logout-link";
        logoutLink.innerHTML =
            '<i class="bi bi-box-arrow-right"></i><span>Logout</span>';
        logoutItem.appendChild(logoutLink);
        links.appendChild(logoutItem);

        logoutLink.addEventListener("click", async (event) => {
            event.preventDefault();

            try {
                await sendRequest("/api/logout", "POST", {});
                window.location.href = "login.html";
            } catch (error) {
                pageMessage.textContent = error.message;
                pageMessage.className = "message error";
            }
        });
    } catch (error) {
        pageMessage.textContent = error.message;
        pageMessage.className = "message error";
    }
}

// Change email.
document.getElementById("email-form").addEventListener("submit", async (event) => {
    event.preventDefault();

    const form = event.currentTarget;
    const button = form.querySelector("button");

    button.disabled = true;

    try {
        const data = await sendRequest("/api/settings/email", "POST", {
            email: document.getElementById("new-email").value.trim(),
            currentPassword:
                document.getElementById("email-current-password").value
        });

        showMessage("email-message", data.message);
        form.reset();
    } catch (error) {
        showMessage("email-message", error.message, true);
    } finally {
        button.disabled = false;
    }
});

// Change password. The backend ends the session after a successful update.
document.getElementById("password-form").addEventListener("submit", async (event) => {
    event.preventDefault();

    const form = event.currentTarget;
    const button = form.querySelector("button");
    const newPassword = document.getElementById("new-password").value;
    const confirmPassword = document.getElementById("confirm-password").value;

    if (newPassword !== confirmPassword) {
        showMessage("password-message", "The new passwords do not match.", true);
        return;
    }

    button.disabled = true;

    try {
        const data = await sendRequest("/api/settings/password", "POST", {
            currentPassword: document.getElementById("current-password").value,
            newPassword,
            confirmPassword
        });

        showMessage("password-message", data.message);
        form.reset();

        setTimeout(() => {
            window.location.href = "login.html";
        }, 1500);
    } catch (error) {
        showMessage("password-message", error.message, true);
    } finally {
        button.disabled = false;
    }
});

// Delete account only after an additional browser confirmation.
document.getElementById("delete-form").addEventListener("submit", async (event) => {
    event.preventDefault();

    const confirmation =
        document.getElementById("delete-confirmation").value;

    if (confirmation !== "DELETE") {
        showMessage("delete-message", 'Type "DELETE" in capital letters.', true);
        return;
    }

    const confirmed = window.confirm(
        "Are you absolutely sure? Your account and associated records will be permanently deleted."
    );

    if (!confirmed) {
        return;
    }

    const form = event.currentTarget;
    const button = form.querySelector("button");
    button.disabled = true;

    try {
        const data = await sendRequest("/api/settings/account", "DELETE", {
            currentPassword:
                document.getElementById("delete-current-password").value,
            confirmation
        });

        showMessage("delete-message", data.message);

        setTimeout(() => {
            window.location.href = "login.html";
        }, 1500);
    } catch (error) {
        showMessage("delete-message", error.message, true);
        button.disabled = false;
    }
});

loadSettingsPage();
