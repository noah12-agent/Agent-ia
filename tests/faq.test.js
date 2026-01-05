const request = require("supertest");

let app;

beforeAll(() => {
  process.env.DATA_FILE = "./storage/test-reservations.json";
  app = require("../src/app");
});

afterAll(() => {
  const fs = require("fs");
  if (fs.existsSync(process.env.DATA_FILE)) {
    fs.unlinkSync(process.env.DATA_FILE);
  }
});

test("GET /faq returns faq data", async () => {
  const response = await request(app).get("/faq");

  expect(response.status).toBe(200);
  expect(Array.isArray(response.body.data)).toBe(true);
  expect(response.body.data.length).toBeGreaterThan(0);
});
