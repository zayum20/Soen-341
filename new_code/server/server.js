const express = require("express");
const mysql = require("mysql2");

const bcrypt = require("bcrypt");
const session = require("express-session");

const app = express();
const PORT = 3000;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(session({
    secret: "careerconnect-secret",
    resave: false,
    saveUninitialized: false
}));

// Serve frontend files
app.use(express.static("public"));

// MySQL connection
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "recruiting_website"
});

// Connect to MySQL
db.connect((error) => {

    if (error) {
        console.error("MySQL connection failed:", error);
        return;
    }

    console.log("Connected to MySQL database!");
});

// Test route
app.get("/api/test", (req, res) => {

    res.json({
        message: "The server is working!"
    });

});


app.post("/api/register/job-seeker", async (req, res) => {

    const {
        firstName,
        lastName,
        email,
        password
    } = req.body;

    try {

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Save account to users table
        const userSql = `
            INSERT INTO users (email, password, role)
            VALUES (?, ?, ?)
        `;

        db.query(
            userSql,
            [email, hashedPassword, "job_seeker"],
            (error, result) => {

                if (error) {
                    console.error("Registration error:", error);

                    return res.status(500).json({
                        message: "Could not create account."
                    });
                }

                // Get the ID of the newly created user
                const userId = result.insertId;

                // Create the user's profile
                const profileSql = `
                    INSERT INTO job_seeker_profiles
                    (user_id, first_name, last_name)
                    VALUES (?, ?, ?)
                `;

                db.query(
                    profileSql,
                    [userId, firstName, lastName],
                    (profileError) => {

                        if (profileError) {
                            console.error(
                                "Profile creation error:",
                                profileError
                            );

                            return res.status(500).json({
                                message: "Account created, but profile could not be created."
                            });
                        }

                        req.session.userId = userId;
                        req.session.role = "job_seeker";

                        console.log("New Job Seeker account created!");
                        console.log("Email:", email);
                        console.log("User ID:", userId);

                        res.json({
                            message: "Job Seeker account created successfully!"
                        });
                    }
                );
            }
        );

    } catch (error) {

        console.error("Password hashing error:", error);

        res.status(500).json({
            message: "Something went wrong."
        });
    }
});



app.post("/api/register/employer", async (req, res) => {
    const {
        companyName,
        contactName,
        email,
        password
    } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const userSql = `
            INSERT INTO users (email, password, role)
            VALUES (?, ?, ?)
        `;

        db.query(
            userSql,
            [email, hashedPassword, "employer"],
            (error, result) => {
                if (error) {
                    console.error("Employer registration error:", error);

                    if (error.code === "ER_DUP_ENTRY") {
                        return res.status(409).json({
                            message: "That email is already being used."
                        });
                    }

                    return res.status(500).json({
                        message: "Could not create employer account."
                    });
                }

                const userId = result.insertId;

                const profileSql = `
                    INSERT INTO employer_profiles
                    (user_id, company_name, contact_name)
                    VALUES (?, ?, ?)
                `;

                db.query(
                    profileSql,
                    [userId, companyName, contactName],
                    (profileError) => {
                        if (profileError) {
                            console.error(
                                "Employer profile creation error:",
                                profileError
                            );

                            return res.status(500).json({
                                message: "Account created, but employer profile could not be created."
                            });
                        }

                        req.session.userId = userId;
                        req.session.role = "employer";

                        console.log("New Employer account created!");
                        console.log("Email:", email);
                        console.log("User ID:", userId);

                        res.json({
                            message: "Employer account created successfully!"
                        });
                    }
                );
            }
        );
    } catch (error) {
        console.error("Password hashing error:", error);

        res.status(500).json({
            message: "Something went wrong."
        });
    }
});



app.post("/api/login", (req, res) => {

    const { email, password } = req.body;

    const sql = `
        SELECT *
        FROM users
        WHERE email = ?
    `;

    db.query(sql, [email], async (error, results) => {

        if (error) {
            console.error("Login error:", error);

            return res.status(500).json({
                message: "Something went wrong."
            });
        }

        // No account with this email
        if (results.length === 0) {
            return res.status(401).json({
                message: "Invalid email or password."
            });
        }

        const user = results[0];

        // Compare entered password with hashed password
        const passwordMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!passwordMatch) {
            return res.status(401).json({
                message: "Invalid email or password."
            });
        }

        // Save the user's ID and role in the session
        req.session.userId = user.id;
        req.session.role = user.role;

        console.log("User logged in!");
        console.log("User ID:", user.id);
        console.log("Role:", user.role);

        res.json({
            message: "Login successful!",
            role: user.role
        });
    });
});

app.get("/api/profile", (req, res) => {

    // Check if someone is logged in
    if (!req.session.userId) {
        return res.status(401).json({
            message: "Not logged in."
        });
    }

    const userId = req.session.userId;
    const role = req.session.role;

    let sql;

    // Job seeker profile
    if (role === "job_seeker") {

        sql = `
            SELECT
                users.id,
                users.email,
                users.role,
                job_seeker_profiles.first_name,
                job_seeker_profiles.last_name,
                job_seeker_profiles.phone,
                job_seeker_profiles.location,
                job_seeker_profiles.about,
                job_seeker_profiles.profile_picture
            FROM users
            LEFT JOIN job_seeker_profiles
                ON users.id = job_seeker_profiles.user_id
            WHERE users.id = ?
        `;

    // Employer profile
    } else if (role === "employer") {

        sql = `
            SELECT
                users.id,
                users.email,
                users.role,
                employer_profiles.company_name,
                employer_profiles.contact_name,
                employer_profiles.phone,
                employer_profiles.location,
                employer_profiles.about,
                employer_profiles.profile_picture
            FROM users
            LEFT JOIN employer_profiles
                ON users.id = employer_profiles.user_id
            WHERE users.id = ?
        `;

    } else {

        return res.status(400).json({
            message: "Invalid user role."
        });
    }

    db.query(sql, [userId], (error, results) => {

        if (error) {
            console.error("Profile retrieval error:", error);

            return res.status(500).json({
                message: "Could not retrieve profile."
            });
        }

        if (results.length === 0) {
            return res.status(404).json({
                message: "Profile not found."
            });
        }

        res.json(results[0]);
    });
});

app.get("/api/profile/skills", (req, res) => {
    if (!req.session.userId) {
        return res.status(401).json({
            message: "Not logged in."
        });
    }

    const userId = req.session.userId;

    const sql = `
        SELECT skill
        FROM job_seeker_skills
        WHERE user_id = ?
        ORDER BY skill
    `;

    db.query(sql, [userId], (error, results) => {
        if (error) {
            console.error("Skills retrieval error:", error);

            return res.status(500).json({
                message: "Could not retrieve skills."
            });
        }

        res.json(results);
    });
});

app.put("/api/profile/skills", (req, res) => {
    if (!req.session.userId) {
        return res.status(401).json({
            message: "Not logged in."
        });
    }

    if (req.session.role !== "job_seeker") {
        return res.status(403).json({
            message: "Only job seekers can update skills."
        });
    }

    const userId = req.session.userId;
    const skills = req.body.skills;

    if (!Array.isArray(skills)) {
        return res.status(400).json({
            message: "Invalid skills."
        });
    }

    // Delete the user's existing skills first
    const deleteSql = `
        DELETE FROM job_seeker_skills
        WHERE user_id = ?
    `;

    db.query(deleteSql, [userId], (deleteError) => {
        if (deleteError) {
            console.error("Skills deletion error:", deleteError);

            return res.status(500).json({
                message: "Could not update skills."
            });
        }

        // If the user selected no skills, we're done
        if (skills.length === 0) {
            return res.json({
                message: "Skills updated successfully!"
            });
        }

        const insertSql = `
            INSERT INTO job_seeker_skills (user_id, skill)
            VALUES ?
        `;

        const values = skills.map((skill) => [userId, skill]);

        db.query(insertSql, [values], (insertError) => {
            if (insertError) {
                console.error("Skills insertion error:", insertError);

                return res.status(500).json({
                    message: "Could not save skills."
                });
            }

            res.json({
                message: "Skills updated successfully!"
            });
        });
    });
});




app.put("/api/profile", (req, res) => {

    // Check if someone is logged in
    if (!req.session.userId) {
        return res.status(401).json({
            message: "Not logged in."
        });
    }

    const userId = req.session.userId;
    const role = req.session.role;

    const {
        firstName,
        lastName,
        companyName,
        contactName,
        email,
        phone,
        location,
        about
    } = req.body;

    // Update email in users table
    if (!email) {
        return res.status(400).json({
            message: "Email is required."
        });
    }

    const userSql = `
        UPDATE users
        SET email = ?
        WHERE id = ?
    `;

    db.query(
        userSql,
        [email, userId],
        (error) => {

            if (error) {

                console.error("Email update error:", error);

                // Email already belongs to another account
                if (error.code === "ER_DUP_ENTRY") {
                    return res.status(409).json({
                        message: "That email is already being used."
                    });
                }

                return res.status(500).json({
                    message: "Could not update email."
                });
            }

            // JOB SEEKER
            if (role === "job_seeker") {

                if (!firstName || !lastName) {
                    return res.status(400).json({
                        message: "First name and last name are required."
                    });
                }

                const profileSql = `
                    UPDATE job_seeker_profiles
                    SET
                        first_name = ?,
                        last_name = ?,
                        phone = ?,
                        location = ?,
                        about = ?
                    WHERE user_id = ?
                `;

                db.query(
                    profileSql,
                    [
                        firstName,
                        lastName,
                        phone,
                        location,
                        about,
                        userId
                    ],
                    (profileError) => {

                        if (profileError) {

                            console.error(
                                "Job seeker profile update error:",
                                profileError
                            );

                            return res.status(500).json({
                                message: "Email updated, but profile could not be updated."
                            });
                        }

                        res.json({
                            message: "Profile updated successfully!"
                        });
                    }
                );

            // EMPLOYER
            } else if (role === "employer") {

                if (!companyName) {
                    return res.status(400).json({
                        message: "Company name is required."
                    });
                }

                const profileSql = `
                    UPDATE employer_profiles
                    SET
                        company_name = ?,
                        contact_name = ?,
                        phone = ?,
                        location = ?,
                        about = ?
                    WHERE user_id = ?
                `;

                db.query(
                    profileSql,
                    [
                        companyName,
                        contactName,
                        phone,
                        location,
                        about,
                        userId
                    ],
                    (profileError) => {

                        if (profileError) {

                            console.error(
                                "Employer profile update error:",
                                profileError
                            );

                            return res.status(500).json({
                                message: "Email updated, but employer profile could not be updated."
                            });
                        }

                        res.json({
                            message: "Employer profile updated successfully!"
                        });
                    }
                );

            } else {

                return res.status(400).json({
                    message: "Invalid user role."
                });
            }
        }
    );
});
 


app.post("/api/logout", (req, res) => {

    req.session.destroy((error) => {

        if (error) {
            console.error("Logout error:", error);

            return res.status(500).json({
                message: "Could not log out."
            });
        }

        res.json({
            message: "Logout successful."
        });
    });

});

// Start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});