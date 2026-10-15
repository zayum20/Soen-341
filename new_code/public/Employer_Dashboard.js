
const hamburger = document.getElementById('hamburger');

if (hamburger) {


hamburger.addEventListener('click', () => {

    const isCollapsed = document.body.classList.toggle('nav-collapsed');

    hamburger.setAttribute('aria-expanded', String(!isCollapsed));

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


} catch (error) {

    console.error('Profile loading error:', error);

}

}

loadProfile();


//Job Posting Form Handler

const jobForm= document.getElementById('create-job-form');

jobForm.addEventListener('submit', async (event) => {

event.preventDefault(); //this function stops the page from reloading automatically when form is submitted.

const jobData = {
    title: document.getElementById('jobTitle').value,
    company: document.getElementById('companyName').value,
    location: document.getElementById('location').value,
    category: document.getElementById('category').value,
    job_type: document.getElementById('jobType').value,
    description: document.getElementById('description').value
}


try {

    const response = await fetch('/api/jobs', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
    body: JSON.stringify(jobData)

    });


    if (response.status === 401) {
    window.location.href = 'login.html';
    return;
    }


    if (!response.ok) {
    throw new Error('Could not load job posting.');
  }

 const result = await response.json();
        alert('Job posted successfully!');
        jobForm.reset();

        } catch (error) {
        console.error('Error:', error);
        alert(error.message);
    }
});

  

//end of job posting form handler


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