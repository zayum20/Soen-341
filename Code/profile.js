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


// Render saved skills from localStorage if present
document.addEventListener('DOMContentLoaded', () => {
    const skillsList = document.getElementById('profile-skills-list');
    const savedSkills = localStorage.getItem('userSkills');

    if (skillsList && savedSkills) {
        try {
            const skills = JSON.parse(savedSkills);
            if (Array.isArray(skills) && skills.length > 0) {
                skillsList.innerHTML = '';
                skills.forEach(skill => {
                    const tag = document.createElement('span');
                    tag.className = 'skill-tag';
                    tag.textContent = skill;
                    skillsList.appendChild(tag);
                });
            }
        } catch (e) {
            console.error('Error rendering saved skills:', e);
        }
    }
});