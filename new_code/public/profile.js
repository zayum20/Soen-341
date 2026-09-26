const hamburger = document.getElementById('hamburger');

if (hamburger) {


hamburger.addEventListener('click', () => {

    const isCollapsed = document.body.classList.toggle('nav-collapsed');

    hamburger.setAttribute('aria-expanded', String(!isCollapsed));

});


}

const profilePic = document.querySelector('.profile-picture img');

const userFile = document.getElementById('file-path');

if (profilePic && userFile) {


userFile.addEventListener('change', function () {

    if (this.files && this.files[0]) {

        profilePic.src = URL.createObjectURL(this.files[0]);

    }

});


}

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