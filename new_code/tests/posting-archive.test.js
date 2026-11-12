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
// These API tests mock SQL results so no class database records are changed.
test("logged-out users cannot archive", async () => {
    expect((await request(app).put("/api/jobs/7/archive")).status).toBe(401);
    expect(db.query).not.toHaveBeenCalled();
});
test("seekers cannot archive", async () => {
    const agent = await login("job_seeker"); db.query.mockClear();
    expect((await agent.put("/api/jobs/7/archive")).status).toBe(403);
    expect(db.query).not.toHaveBeenCalled();
});
test("archive updates only the owner's posting and preserves the original archive date", async () => {
    const agent = await login();
    db.query.mockImplementationOnce((sql, params, cb) => {
        expect(sql).toContain("COALESCE(archived_at, CURRENT_TIMESTAMP)");
        expect(sql).toContain("WHERE id = ? AND employer_id = ?");
        expect(params).toEqual([7, 42]);
        cb(null, { affectedRows: 1 });
    });
    expect((await agent.put("/api/jobs/7/archive")).status).toBe(200);
});
test("another recruiter's posting cannot be archived", async () => {
    const agent = await login();
    db.query.mockImplementationOnce((sql, params, cb) => cb(null, { affectedRows: 0 }));
    expect((await agent.put("/api/jobs/7/archive")).status).toBe(404);
});
test("invalid posting IDs never reach the database", async () => {
    const agent = await login(); db.query.mockClear();
    expect((await agent.put("/api/jobs/7abc/archive")).status).toBe(400);
    expect(db.query).not.toHaveBeenCalled();
});
test("archive database failures are reported", async () => {
    const agent = await login();
    db.query.mockImplementationOnce((sql, params, cb) => cb(new Error("offline")));
    expect((await agent.put("/api/jobs/7/archive")).status).toBe(500);
});
test("seeker search excludes archived postings", async () => {
    db.query.mockImplementationOnce((sql, params, cb) => {
        expect(sql).toContain("WHERE jobs.archived_at IS NULL AND (");
        cb(null, []);
    });
    expect((await request(app).get("/api/jobs?q=developer")).status).toBe(200);
});
test("employers can still list archived jobs", async () => {
    const agent = await login();
    db.query.mockImplementationOnce((sql, params, cb) => {
        expect(sql).not.toContain("WHERE archived_at IS NULL");
        cb(null, [{ id: 7, archived_at: "2026-11-12", status: "archived" }]);
    });
    const response = await agent.get("/api/employer/jobs");
    expect(response.body[0].status).toBe("archived");
});
test("new applications to archived jobs are rejected before copying a resume", async () => {
    const agent = await login("job_seeker"); db.query.mockClear();
    db.query.mockImplementationOnce((sql, params, cb) => cb(null, [{ id: 7, archived_at: "2026-11-12" }]));
    expect((await agent.post("/api/applications").send({ jobId: 7 })).status).toBe(409);
    expect(db.query).toHaveBeenCalledTimes(1);
});
