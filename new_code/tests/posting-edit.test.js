const request = require("supertest");
const bcrypt = require("bcrypt");
jest.mock("mysql2", () => ({ createConnection: jest.fn(() => ({ query: jest.fn(), connect: jest.fn() })) }));
const mysql = require("mysql2");
const app = require("../server/server");
const db = mysql.createConnection.mock.results[0].value;
const posting = { title: " Developer ", company: "Demo", location: "Montreal", category: "IT", job_type: "Full-time", description: "Build things" };
let password;
beforeAll(async () => { password = await bcrypt.hash("test-password", 4); });
beforeEach(() => db.query.mockReset());
async function login(role = "employer") {
    db.query.mockImplementationOnce((sql, params, cb) => cb(null, [{ id: 42, role, password }]));
    const agent = request.agent(app);
    const response = await agent.post("/api/login").send({ email: "demo@example.com", password: "test-password" });
    expect(response.status).toBe(200);
    return agent;
}
test("logged-out users cannot edit", async () => {
    expect((await request(app).put("/api/jobs/7").send(posting)).status).toBe(401);
    expect(db.query).not.toHaveBeenCalled();
});
test("seekers cannot edit", async () => {
    const agent = await login("job_seeker"); db.query.mockClear();
    expect((await agent.put("/api/jobs/7").send(posting)).status).toBe(403);
    expect(db.query).not.toHaveBeenCalled();
});
test("owners can save trimmed fields without changing ownership", async () => {
    const agent = await login();
    db.query.mockImplementationOnce((sql, params, cb) => { expect(params).toEqual([7, 42]); cb(null, [{ id: 7 }]); });
    db.query.mockImplementationOnce((sql, params, cb) => {
        expect(sql).toMatch(/WHERE id = \? AND employer_id = \?/);
        expect(params).toEqual(["Developer", "Demo", "Montreal", "IT", "Full-time", "Build things", 7, 42]);
        cb(null, { affectedRows: 1 });
    });
    expect((await agent.put("/api/jobs/7").send({ ...posting, employer_id: 99 })).status).toBe(200);
});
test("another recruiter's posting cannot be updated", async () => {
    const agent = await login(); db.query.mockClear();
    db.query.mockImplementationOnce((sql, params, cb) => cb(null, []));
    expect((await agent.put("/api/jobs/7").send(posting)).status).toBe(404);
    expect(db.query).toHaveBeenCalledTimes(1);
});
test.each([{ title: " " }, { title: 123 }, { job_type: "Invalid" }, { category: "x".repeat(101) }])("rejects invalid fields %j", async invalid => {
    const agent = await login(); db.query.mockClear();
    expect((await agent.put("/api/jobs/7").send({ ...posting, ...invalid })).status).toBe(400);
    expect(db.query).not.toHaveBeenCalled();
});
test("rejects invalid IDs", async () => {
    const agent = await login(); db.query.mockClear();
    expect((await agent.put("/api/jobs/7abc").send(posting)).status).toBe(400);
    expect(db.query).not.toHaveBeenCalled();
});
test("reports database failure without claiming success", async () => {
    const agent = await login();
    db.query.mockImplementationOnce((sql, params, cb) => cb(null, [{ id: 7 }]));
    db.query.mockImplementationOnce((sql, params, cb) => cb(new Error("database unavailable")));
    expect((await agent.put("/api/jobs/7").send(posting)).status).toBe(500);
});
