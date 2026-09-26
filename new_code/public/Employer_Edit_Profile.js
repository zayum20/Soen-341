async function loadEmployerProfile() {

    try {

        const response = await fetch('/api/profile');

        if (!response.ok) {
            throw new Error('Could not load employer profile.');
        }

        const profile = await response.json();

        if (profile.role !== 'employer') {
            window.location.href = 'Profile.html';
            return;
        } 
        
        document.getElementById('companyName').value =
            profile.company_name || '';

        document.getElementById('contactName').value =
            profile.contact_name || '';

        document.getElementById('email').value =
            profile.email || '';

        document.getElementById('number').value =
            profile.phone || '';

        document.getElementById('location').value =
            profile.location || '';

        document.getElementById('about').value =
            profile.about || '';

    } catch (error) {

        console.error(
            'Error loading employer profile:',
            error
        );

        alert('Could not load your company profile.');
    }
}

loadEmployerProfile();


const editForm = document.querySelector('.edit-form');

editForm.addEventListener('submit', async (event) => {

    event.preventDefault();

    const companyName =
        document.getElementById('companyName').value;

    const contactName =
        document.getElementById('contactName').value;

    const email =
        document.getElementById('email').value;

    const phone =
        document.getElementById('number').value;

    const location =
        document.getElementById('location').value;

    const about =
        document.getElementById('about').value;


    try {

        const response = await fetch('/api/profile', {

            method: 'PUT',

            headers: {
                'Content-Type': 'application/json'
            },

            body: JSON.stringify({

                companyName: companyName,
                contactName: contactName,
                email: email,
                phone: phone,
                location: location,
                about: about

            })
        });


        const data = await response.json();

  
        if (response.ok) {

            alert('Company profile updated successfully!');

            window.location.href =
                'Employer_Profile.html';

        } else {

            alert(data.message);
        }


    } catch (error) {

        console.error(
            'Employer profile update error:',
            error
        );

        alert('Could not connect to the server.');
    }

});