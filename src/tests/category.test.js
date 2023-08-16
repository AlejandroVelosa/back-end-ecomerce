const request = require("supertest");
const app = require("../app");
require("../models");

const URL_CATEGORY = "/api/v1/categories";
const URL_CATEGORY_USERS = "/api/v1/users";
let TOKEN;
let categoryId;

beforeAll(async () => {
  const user = {
    email: "alejovelosa@gmail.com",
    password: "alejito",
  };

  const res = await request(app).post(`${URL_CATEGORY_USERS}/login`).send(user);

  TOKEN = res.body.token;
});

// test post
// test get
// test delete

test("POST -> 'URL_cATEGORY', should return status code 201 and res.body.name === body.name", async () => {
  const category = {
    name: "tecno",
  };

  const res = await request(app)
    .post(URL_CATEGORY)
    .send(category)
    .set("Authorization", `Bearer ${TOKEN}`);

  categoryId = res.body.id;

  expect(res.statusCode).toBe(201);
  expect(res.body).toBeDefined();
  expect(res.body.name).toBe(category.name);
});

test("GET -> 'URL_cATEGORY', should return status code 200 and res.body.length === 1", async () => {
  const res = await request(app).get(URL_CATEGORY);

  expect(res.statusCode).toBe(200);
  expect(res.body).toBeDefined();
  expect(res.body).toHaveLength(1);
});

test("DELETE -> 'URL_cATEGORY/:id', should return status code 204 ", async () => {
  const res = await request(app)
    .delete(`${URL_CATEGORY}/${categoryId}`)
    .set("Authorization", `Bearer ${TOKEN}`);

  expect(res.statusCode).toBe(204);
});
