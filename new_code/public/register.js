const form = document.querySelector("form");

form.addEventListener("submit", async function (event) {

    event.preventDefault();

    const firstName = document.querySelector("#firstName").value.trim();
    const lastName = document.querySelector("#lastName").value.trim();
    const email = document.querySelector("#email").value.trim();
    const password = document.querySelector("#password").value;
    const confirmPassword = document.querySelector("#confirmPassword").value;

    // Name validation
    const namePattern = /^[A-Za-zÀ-ÖØ-öø-ÿ' -]+$/;

    if (!namePattern.test(firstName)) {
        alert("First name can only contain letters, spaces, hyphens, and apostrophes.");
        return;
    }

    if (!namePattern.test(lastName)) {
        alert("Last name can only contain letters, spaces, hyphens, and apostrophes.");
        return;
    }

    // Email validation
    const emailPattern =
    /^[^\s@]+@(gmail\.com|hotmail\.com|outlook\.com|yahoo\.com|icloud\.com|proton\.me|protonmail\.com)$/i;

if (!emailPattern.test(email)) {
    alert(
        "Please enter a valid email address using a supported email provider " +
        "(for example, Gmail, Outlook, Hotmail, Yahoo, iCloud, or Proton)."
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

    const userData = {
        firstName,
        lastName,
        email,
        password
    };

    try {

        const response = await fetch("/api/register/job-seeker", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(userData)
        });

        const result = await response.json();

        console.log(result);

        if (response.ok) {
            alert("Account created successfully!");
            window.location.href = "Profile.html";
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