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
