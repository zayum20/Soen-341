const loginForm = document.getElementById("login-form");

loginForm.addEventListener("submit", async (event) => {

    // Prevent the page from refreshing
    event.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {

        const response = await fetch("/api/login", {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                email: email,
                password: password
            })
        });

        const data = await response.json();

        if (response.ok) {

            alert("Login successful!");

            // Go to the profile page
            if (data.role === "job_seeker") {
                window.location.href = "Profile.html";
            } else if (data.role === "employer") {
                window.location.href = "Employer_Profile.html";
            }

        } else {

            alert(data.message);

        }

    } catch (error) {

        console.error("Login error:", error);

        alert("Could not connect to the server.");

    }

});