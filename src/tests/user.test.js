const request = require("supertest");
const app = require("../app");
require("../models");

const URL_USER = "/api/v1/users";
let TOKEN;
let userId;

beforeAll(async () => {
  const user = {
    email: "alejovelosa@gmail.com",
    password: "alejito",
  };

  const res = await request(app).post(`${URL_USER}/login`).send(user);

  TOKEN = res.body.token;
});

test("GET -> 'URL_USER' , should return status code 200  and res.body.length === 1 ", async () => {
  const res = await request(app)
    .get(URL_USER)
    .set("Authorization", `Bearer ${TOKEN}`);

  expect(res.statusCode).toBe(200);
  expect(res.body).toBeDefined();
  expect(res.body).toHaveLength(1);
});

test("POST -> 'URL_USER' , should return status code 201 ans res.body.firstnAME === user.firstName ", async () => {
  const user = {
    firstName: "camilo",
    lastName: "pardo",
    email: "alejovelosa4@gmail.com",
    password: "alejito",
    phone: "3133244768",
  };

  const res = await request(app).post(URL_USER).send(user);

  userId = res.body.id;

  expect(res.statusCode).toBe(201);
  expect(res.body).toBeDefined();
  expect(res.body.firstName).toBe(user.firstName);
});

test("Update -> 'URL_USER/:id' , should return status code 200 res.body.firstName === userUpdate.firstName", async () => {
  const userUpdate = {
    firstName: "alejandra",
  };

  const res = await request(app)
    .put(`${URL_USER}/${userId}`)
    .send(userUpdate)
    .set("Authorization", `Bearer ${TOKEN}`);

  expect(res.statusCode).toBe(200);
  expect(res.body).toBeDefined();
  expect(res.body.firstName).toBe(userUpdate.firstName);
});

test("POST ->  'URL_USER/login', should retunr status code 200 and res.body.token is to be defined  res.body.email ===  user.email", async () => {
  const user = {
    email: "alejovelosa4@gmail.com",
    password: "alejito",
  };
  const res = await request(app).post(`${URL_USER}/login`).send(user);

  expect(res.statusCode).toBe(200);
  expect(res.body).toBeDefined();
  expect(res.body.user.email).toBe(user.email);
  expect(res.body.token).toBeDefined();
});

test("POST ->  'URL_USER/login', should retunr status code 401", async () => {
  const user = {
    email: "alejovelosa4@gmail.com",
    password: "invalid password",
  };
  const res = await request(app).post(`${URL_USER}/login`).send(user);

  expect(res.statusCode).toBe(401);
});

test("POST ->  'URL_USER/:id', should retunr status code 204", async () => {
  const res = await request(app)
    .delete(`${URL_USER}/${userId}`)
    .set("Authorization", `Bearer ${TOKEN}`);

  expect(res.statusCode).toBe(204);
});
