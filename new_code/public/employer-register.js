const form = document.querySelector("form");

form.addEventListener("submit", async function (event) {

    event.preventDefault();

    const companyName =
        document.querySelector("#companyName").value.trim();

    const contactName =
        document.querySelector("#contactName").value.trim();

    const email =
        document.querySelector("#email").value.trim();

    const password =
        document.querySelector("#password").value;

    const confirmPassword =
        document.querySelector("#confirmPassword").value;


    // Company name validation
    if (companyName.length < 2 || companyName.length > 100) {
        alert("Company name must be between 2 and 100 characters.");
        return;
    }


    // Contact name validation
    const namePattern = /^[A-Za-zÀ-ÖØ-öø-ÿ' -]+$/;

    if (!namePattern.test(contactName)) {
        alert(
            "Contact name can only contain letters, spaces, hyphens, and apostrophes."
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


    // Password validation
    const passwordPattern =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

    if (!passwordPattern.test(password)) {
        alert(
            "Password must be at least 8 characters long and contain " +
            "at least one uppercase letter, one lowercase letter, and one number."
        );
        return;
    }


    // Confirm password
    if (password !== confirmPassword) {
        alert("Passwords do not match.");
        return;
    }


    const employerData = {
        companyName,
        contactName,
        email,
        password
    };


    try {

        const response = await fetch("/api/register/employer", {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(employerData)
        });


        const result = await response.json();

        console.log(result);

        if (response.ok) {
            alert("Employer account created successfully!");
            window.location.href = "Employer_Profile.html";
        } else {
            alert(result.message);
        }


        if (response.ok) {
            form.reset();
        }


    } catch (error) {

        console.error("Registration error:", error);

        alert("Something went wrong. Please try again.");

    }

});