
const request = require("supertest");
const bcrypt = require("bcrypt");

jest.mock("mysql2", () => ({
    createConnection: jest.fn(() => ({
        query: jest.fn(),
        connect: jest.fn()
    }))
}));

const mysql = require("mysql2");
const app = require("../server/server");

const db = mysql.createConnection.mock.results[0].value;

describe("CareerConnect API Tests", () => {

    beforeEach(() => {
        db.query.mockReset();
    });

    test("GET /api/test should confirm that the server is working", async () => {
        const response = await request(app).get("/api/test");

        expect(response.status).toBe(200);
        expect(response.body.message).toBe("The server is working!");
    });

    test("POST /api/login should reject an unknown email", async () => {
        db.query.mockImplementation((sql, values, callback) => {
            callback(null, []);
        });

        const response = await request(app)
            .post("/api/login")
            .send({
                email: "unknown@example.com",
                password: "Password123!"
            });

        expect(response.status).toBe(401);
        expect(response.body.message).toBe("Invalid email or password.");
    });

    test("GET /api/profile should reject users who are not logged in", async () => {
        const response = await request(app).get("/api/profile");

        expect(response.status).toBe(401);
        expect(response.body.message).toBe("Not logged in.");
    });

    test("A user with valid credentials should log in and access their profile", async () => {
        const hashedPassword = await bcrypt.hash("Password123!", 10);

        db.query
            .mockImplementationOnce((sql, values, callback) => {
                callback(null, [{
                    id: 42,
                    email: "test@example.com",
                    password: hashedPassword,
                    role: "job_seeker"
                }]);
            })
            .mockImplementationOnce((sql, values, callback) => {
                callback(null, [{
                    id: 42,
                    email: "test@example.com",
                    role: "job_seeker",
                    first_name: "Test",
                    last_name: "User"
                }]);
            });

        const agent = request.agent(app);

        const loginResponse = await agent
            .post("/api/login")
            .send({
                email: "test@example.com",
                password: "Password123!"
            });

        expect(loginResponse.status).toBe(200);
        expect(loginResponse.body.message).toBe("Login successful!");
        expect(loginResponse.body.role).toBe("job_seeker");

        const profileResponse = await agent.get("/api/profile");

        expect(profileResponse.status).toBe(200);
        expect(profileResponse.body.email).toBe("test@example.com");
        expect(profileResponse.body.first_name).toBe("Test");
    });

    test("POST /api/login should reject an incorrect password", async () => {
    const hashedPassword = await bcrypt.hash("CorrectPassword123!", 10);

    db.query.mockImplementation((sql, values, callback) => {
        callback(null, [{
            id: 42,
            email: "test@example.com",
            password: hashedPassword,
            role: "job_seeker"
        }]);
    });

    const response = await request(app)
        .post("/api/login")
        .send({
            email: "test@example.com",
            password: "WrongPassword123!"
        });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Invalid email or password.");
});



test("POST /api/register/job-seeker should create an account", async () => {

    db.query
        .mockImplementationOnce((sql, values, callback) => {
            callback(null, { insertId: 101 });
        })
        .mockImplementationOnce((sql, values, callback) => {
            callback(null, { affectedRows: 1 });
        });

    const response = await request(app)
        .post("/api/register/job-seeker")
        .send({
            firstName: "Alex",
            lastName: "Smith",
            email: "alex@example.com",
            password: "Password123!"
        });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe(
        "Job Seeker account created successfully!"
    );
});

test("POST /api/register/employer should reject a duplicate email", async () => {

    db.query.mockImplementation((sql, values, callback) => {
        const error = new Error("Duplicate email");
        error.code = "ER_DUP_ENTRY";
        callback(error);
    });

    const response = await request(app)
        .post("/api/register/employer")
        .send({
            companyName: "Test Company",
            contactName: "Alex Smith",
            email: "existing@example.com",
            password: "Password123!"
        });

    expect(response.status).toBe(409);
    expect(response.body.message).toBe(
        "That email is already being used."
    );
});


});
