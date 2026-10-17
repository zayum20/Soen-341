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
    
    if (profile.role !== 'employer') {
    window.location.href = 'Profile.html';
    return;
}

    // Display company name
    document.getElementById('profile-company').textContent =
    profile.company_name;

    document.getElementById('profile-contact').textContent =
    profile.contact_name || 'No contact name provided';

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

// "Upload Photo" triggers file chooser
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

// Save selected picture to server
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