const hamburger = document.getElementById('hamburger');

if (hamburger) {


hamburger.addEventListener('click', () => {

    const isCollapsed = document.body.classList.toggle('nav-collapsed');

    hamburger.setAttribute('aria-expanded', String(!isCollapsed));

});


}

const profilePic = document.querySelector('.profile-picture img');

const userFile = document.getElementById('file-path');


// Load the logged-in user's profile
async function loadProfile() {


try {

    const response = await fetch('/api/profile');

    if (response.status === 401) {
    window.location.href = 'login.html';
    return;
    }

if (!response.ok) {
    throw new Error('Could not load profile.');
}


    const profile = await response.json();

     // Check that the logged-in user is a job seeker
    if (profile.role !== 'job_seeker') {
        window.location.href = 'Employer_Profile.html';
        return;
    }

    // Display name
    document.getElementById('profile-name').textContent =
        `${profile.first_name} ${profile.last_name}`;

    // Display career type
    document.getElementById('profile-career').textContent =
        profile.role === 'job_seeker'
            ? 'Job Seeker'
            : 'Employer';

    // Display email
    document.getElementById('profile-email').textContent =
        profile.email;

    // Display phone
    document.getElementById('profile-phone').textContent =
        profile.phone || 'Not provided';

    // Display location
    document.getElementById('profile-location').textContent =
        profile.location || 'Not provided';

    // Display About Me
    document.getElementById('profile-about').textContent =
        profile.about || 'No information provided.';

    // Display profile picture
    if (profile.profile_picture) {
        profilePic.src = profile.profile_picture;
    }

     // Resume display logic
    const resumePreview = document.getElementById("resume-preview");
    const resumeIframe = document.getElementById("resume-iframe");
    const resumeBox = document.getElementById("resume-box");
    const resumeToggle = document.getElementById("resume-toggle");

            if (resumeToggle) resumeToggle.style.display = "flex";

    const resumeActions = document.getElementById("resume-actions");
    if (resumeActions) resumeActions.setAttribute("hidden", "hidden");

    if (profile.resume_path) {
        resumeIframe.src = profile.resume_path;
        resumePreview.removeAttribute("hidden");
        resumeBox.setAttribute("hidden", "hidden");
    } else {
        resumeIframe.src = "";
        resumePreview.setAttribute("hidden", "hidden");
        resumeBox.removeAttribute("hidden");
    }

} catch (error) {

    console.error('Profile loading error:', error);

}

}

loadProfile();

const logoutLink = document.getElementById('logout-link');

if (logoutLink) {

    logoutLink.addEventListener('click', async (event) => {

        event.preventDefault();

        try {

            const response = await fetch('/api/logout', {
                method: 'POST'
            });

            const data = await response.json();

            if (response.ok) {

                alert('You have been logged out.');

                window.location.href = 'login.html';

            } else {

                alert(data.message);

            }

        } catch (error) {

            console.error('Logout error:', error);

            alert('Could not connect to the server.');

        }

    });

}

const skillsToggle = document.getElementById("skills-toggle");
const skillsOptions = document.getElementById("skills-options");

if (skillsToggle && skillsOptions) {
    skillsToggle.addEventListener("click", () => {
        skillsOptions.classList.toggle("show");
        skillsToggle.classList.toggle("open");
    });
}

const saveSkillsButton = document.getElementById("save-skills-btn");

if (saveSkillsButton) {
    saveSkillsButton.addEventListener("click", async () => {

        const selectedSkills = [];

        document
            .querySelectorAll('input[name="skills"]:checked')
            .forEach((checkbox) => {
                selectedSkills.push(checkbox.value);
            });

        try {
            const response = await fetch("/api/profile/skills", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    skills: selectedSkills
                })
            });

            const result = await response.json();

            if (response.ok) {
                alert("Skills saved successfully!");
                loadSkills();
            } else {
                alert(result.message);
            }

        } catch (error) {
            console.error("Skills update error:", error);
            alert("Could not connect to the server.");
        }
    });
}

const resumeToggle = document.getElementById("resume-toggle");
const resumeBox = document.getElementById("resume-box");

if (resumeToggle) {
    resumeToggle.addEventListener("click", () => {
        const resumePreview = document.getElementById("resume-preview");
        const resumeActions = document.getElementById("resume-actions");
        const hasResume = resumePreview && !resumePreview.hasAttribute("hidden");

        if (hasResume && resumeActions) {
            // Resume exists: toggle "Remove Resume" button
            if (resumeActions.hasAttribute("hidden")) {
                resumeActions.removeAttribute("hidden");
            } else {
                resumeActions.setAttribute("hidden", "hidden");
            }
        } else if (resumeBox) {
            // No resume: toggle upload box
            if (resumeBox.hasAttribute("hidden")) {
                resumeBox.removeAttribute("hidden");
            } else {
                resumeBox.setAttribute("hidden", "hidden");
            }
        }
    });
}

const saveResumeBtn = document.querySelector(".resume-save");
const resumeFileInput = document.getElementById("resume-file");

if (saveResumeBtn && resumeFileInput) {
    saveResumeBtn.addEventListener("click", async () => {
        const file = resumeFileInput.files[0];
        if (!file) return alert("Please select a file first.");

        const formData = new FormData();
        formData.append("resume", file);

        try {
            const response = await fetch("/api/profile/resume", {
                method: "POST",
                body: formData
            });

            const data = await response.json();
            if (response.ok) {
                alert("Resume uploaded successfully!");
                resumeBox.setAttribute("hidden", "hidden");
                resumeToggle.setAttribute("aria-expanded", "false");
                loadProfile(); // refresh profile view
            } else {
                alert(data.message || "Failed to upload resume.");
            }
        } catch (error) {
            console.error("Resume upload error:", error);
            alert("Could not upload resume.");
        }
    });
}

async function loadSkills() {
    try {
        const response = await fetch("/api/profile/skills");

        if (response.status === 401) {
            window.location.href = "login.html";
            return;
        }

        if (!response.ok) {
            throw new Error("Could not load skills.");
        }

        const skills = await response.json();

        const selectedSkills =
            document.getElementById("selected-skills");

        selectedSkills.innerHTML = "";

        skills.forEach((skill) => {

            const checkbox = document.querySelector(
                `input[name="skills"][value="${skill.skill}"]`
            );

            if (checkbox) {
                checkbox.checked = true;
            }

            const tag = document.createElement("span");

            tag.classList.add("skill-tag");
            tag.textContent = skill.skill;

            selectedSkills.appendChild(tag);
        });

    } catch (error) {
        console.error("Skills loading error:", error);
    }
}
loadSkills();
const cameraBtn = document.getElementById('camera-btn');
const avatarMenu = document.getElementById('avatar-menu');
const uploadPhotoBtn = document.getElementById('upload-photo-btn');
const deleteAvatarBtn = document.getElementById('delete-avatar-btn');

// Toggle menu
cameraBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    avatarMenu.hidden = !avatarMenu.hidden;
});

// Close menu when clicking outside
document.addEventListener('click', () => {
    if (avatarMenu) avatarMenu.hidden = true;
});

// "Upload Photo" triggers hidden file input
uploadPhotoBtn?.addEventListener('click', () => {
    userFile.click();
    avatarMenu.hidden = true;
});

// "Remove Photo" calls DELETE API
deleteAvatarBtn?.addEventListener('click', async () => {
    avatarMenu.hidden = true;
    if (!confirm('Remove profile picture?')) return;

    const res = await fetch('/api/profile/avatar', { method: 'DELETE' });
    const data = await res.json();
    if (res.ok) profilePic.src = data.profile_picture;
});

// Handle profile picture upload
if (userFile) {
    userFile.addEventListener('change', async function () {
        if (!this.files[0]) return;

        const formData = new FormData();
        formData.append('avatar', this.files[0]);

        try {
            const response = await fetch('/api/profile/avatar', {
                method: 'POST',
                body: formData
            });

            const data = await response.json();

            if (response.ok) {
                alert('Profile picture updated successfully!');
                profilePic.src = data.profile_picture;
            } else {
                alert(data.message || 'Failed to upload picture.');
            }
        } catch (error) {
            console.error('Upload error:', error);
            alert('Could not upload image.');
        }
    });
}

// Delete resume
const deleteResumeBtn = document.getElementById("delete-resume-btn");
if (deleteResumeBtn) {
    deleteResumeBtn.addEventListener("click", async () => {
        if (!confirm("Are you sure you want to remove your resume?")) return;

        const response = await fetch("/api/profile/resume", { method: "DELETE" });
        if (response.ok) {
            alert("Resume removed.");
            document.getElementById("resume-iframe").src = "";
            document.getElementById("resume-preview").setAttribute("hidden", "hidden");
            loadProfile();
        } else {
            alert("Could not remove resume.");
        }
    });
}