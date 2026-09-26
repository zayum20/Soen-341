async function loadEditProfile() {

    try {

        const response = await fetch('/api/profile');

        if (!response.ok) {
            throw new Error('Could not load profile.');
        }

        const profile = await response.json();
        if (profile.role !== 'job_seeker') {
        window.location.href = 'Employer_Profile.html';
        return;
        }

        // Fill in the form fields
        document.getElementById('firstName').value =
            profile.first_name || '';

        document.getElementById('lastName').value =
            profile.last_name || '';

        document.getElementById('email').value =
            profile.email || '';

        document.getElementById('number').value =
            profile.phone || '';

        document.getElementById('location').value =
            profile.location || '';

        document.getElementById('about').value =
            profile.about || '';

    } catch (error) {

        console.error('Error loading edit profile:', error);

        alert('Could not load your profile.');

    }

}

loadEditProfile();

const editForm = document.querySelector('.edit-form');

editForm.addEventListener('submit', async (event) => {

    event.preventDefault();

    const firstName =
    document.getElementById('firstName').value.trim();

const lastName =
    document.getElementById('lastName').value.trim();

const phone =
    document.getElementById('number').value.trim();

const email =
    document.getElementById('email').value.trim();

const location =
    document.getElementById('location').value.trim();

const about =
    document.getElementById('about').value.trim();


// Name validation
const namePattern = /^[A-Za-zÀ-ÖØ-öø-ÿ' -]+$/;

if (
    firstName.length < 2 ||
    firstName.length > 50 ||
    !namePattern.test(firstName)
) {
    alert(
        "First name must contain only letters, spaces, hyphens, or apostrophes."
    );
    return;
}

if (
    lastName.length < 2 ||
    lastName.length > 50 ||
    !namePattern.test(lastName)
) {
    alert(
        "Last name must contain only letters, spaces, hyphens, or apostrophes."
    );
    return;
}


// Phone validation
const phonePattern =
    /^(?:\+1[\s.-]?)?(?:\d{3})[\s.-]?\d{3}[\s.-]?\d{4}$/;

if (!phonePattern.test(phone)) {
    alert(
        "Please enter a valid 10-digit phone number. " +
        "Example: 514-123-4567"
    );
    return;
}


// Email validation
const emailPattern =
    /^[^\s@]+@(gmail\.com|hotmail\.com|outlook\.com|live\.com|msn\.com|yahoo\.com|icloud\.com|me\.com|proton\.me|protonmail\.com|aol\.com|mail\.com)$/i;

if (!emailPattern.test(email)) {
    alert(
        "Please enter a valid email address using a supported email provider."
    );
    return;
}


// Location validation
if (location.length < 2 || location.length > 255) {
    alert("Please enter a valid location.");
    return;
}


// About validation


    try {

        const response = await fetch('/api/profile', {
            method: 'PUT',

            headers: {
                'Content-Type': 'application/json'
            },

            body: JSON.stringify({
                firstName: firstName,
                lastName: lastName,
                email: email,
                phone: phone,
                location: location,
                about: about
            })
        });

        const data = await response.json();

        if (response.ok) {

            alert('Profile updated successfully!');

            window.location.href = 'Profile.html';

        } else {

            alert(data.message);

        }

    } catch (error) {

        console.error('Profile update error:', error);

        alert('Could not connect to the server.');

    }

});