const request = require("supertest");
const fs = require("fs");

let app;

beforeAll(() => {
  process.env.DATA_FILE = "./storage/test-reservations.json";
  app = require("../src/app");
});

afterEach(() => {
  if (fs.existsSync(process.env.DATA_FILE)) {
    fs.unlinkSync(process.env.DATA_FILE);
  }
});

test("POST /reservations creates reservation", async () => {
  const payload = {
    name: "Marie Curie",
    phone: "+33123456789",
    date: "2024-10-12",
    time: "19:30",
    people: 2,
    note: "Table près de la fenêtre"
  };

  const response = await request(app).post("/reservations").send(payload);

  expect(response.status).toBe(201);
  expect(response.body.data).toMatchObject({
    name: payload.name,
    phone: payload.phone,
    date: payload.date,
    time: payload.time,
    people: payload.people,
    note: payload.note,
    status: "pending"
  });
});

test("GET /admin/reservations lists reservations", async () => {
  await request(app).post("/reservations").send({
    name: "Jean Dupont",
    phone: "0102030405",
    date: "2024-11-01",
    time: "20:00",
    people: 4
  });

  const response = await request(app).get("/admin/reservations");

  expect(response.status).toBe(200);
  expect(response.body.data.length).toBe(1);
});

test("PATCH /admin/reservations/:id/status updates status", async () => {
  const createResponse = await request(app).post("/reservations").send({
    name: "Alice",
    phone: "0102030406",
    date: "2024-12-01",
    time: "21:00",
    people: 3
  });

  const reservationId = createResponse.body.data.id;

  const response = await request(app)
    .patch(`/admin/reservations/${reservationId}/status`)
    .send({ status: "confirmed" });

  expect(response.status).toBe(200);
  expect(response.body.data.status).toBe("confirmed");
});
