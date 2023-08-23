const request = require("supertest");
const app = require("../app");
const Category = require("../models/Category");
const ProductImg = require("../models/ProductImg");
require("../models");

const URL_PRODUCT = "/api/v1/products";
const URL_BASE_USER = "/api/v1/users/login";
let TOKEN;
let product;
let category;
let productId;
let image;

beforeAll(async () => {
  const user = {
    email: "alejovelosa@gmail.com",
    password: "alejito",
  };

  const res = await request(app).post(URL_BASE_USER).send(user);
  TOKEN = res.body.token;

  const categoryBody = {
    name: "perfums",
  };

  category = await Category.create(categoryBody);

  product = {
    title: " blue de chanel",
    description:
      "El elogio a la libertad, que se expresa en un aromático amaderado de estela cautivadora. Una fragancia atemporal en un frasco de un azul profundo y misterioso. BLEU DE CHANEL Parfum afirma un carácter consumado en una fórmula pura e intensa. Un sello intensamente masculino que encarna plenitud y confianza en sí mismo.",
    price: 199.99,
    categoryId: category.id,
  };
});

test("POST -> 'URL_PRODUCT ' should return status code 201 and res.body.title === product.title", async () => {
  const res = await request(app)
    .post(URL_PRODUCT)
    .send(product)
    .set("Authorization", `Bearer ${TOKEN}`);

  productId = res.body.id;

  expect(res.statusCode).toBe(201);
  expect(res.body).toBeDefined();
  expect(res.body.title).toBe(product.title);
});

test("GET ALL -> 'URL_PRODUCT ' should return status code 200 and res.body to be defined  res.body.length === 1 ", async () => {
  const res = await request(app).get(URL_PRODUCT);

  expect(res.statusCode).toBe(200);
  expect(res.body).toBeDefined();
  expect(res.body).toHaveLength(1);
  expect(res.body[0].category).toBeDefined();
  expect(res.body[0].category.id).toBe(category.id);
});

test("GET ALL -> 'URL_PRODUCT?category=id ' should return status code 200 and res.body to be defined  res.body.length === 1, to be defined  and res.body[0].category.id", async () => {
  // /api/v1/products?category=1
  const res = await request(app).get(`${URL_PRODUCT}?category=${category.id}`);

  expect(res.statusCode).toBe(200);
  expect(res.body).toBeDefined();
  expect(res.body).toHaveLength(1);
  expect(res.body[0].category).toBeDefined();
  expect(res.body[0].category.id).toBe(category.id);
});

test("GET ONE -> 'URL_PRODUCT/:id ' should return status code 200 and res.body to be defined  res.body.title === product.title ", async () => {
  const res = await request(app).get(`${URL_PRODUCT}/${productId}`);

  expect(res.statusCode).toBe(200);
  expect(res.body).toBeDefined();
  expect(res.body.title).toBe(product.title);
});

test("PUT -> 'URL_PRODUCT/:id ' should return status code 200 and res.body.title === productUpdate.title", async () => {
  const productUpdate = {
    title: " jean paul cartier ",
  };
  const res = await request(app)
    .put(`${URL_PRODUCT}/${productId}`)
    .send(productUpdate)
    .set("Authorization", `Bearer ${TOKEN}`);

  expect(res.statusCode).toBe(200);
  expect(res.body).toBeDefined();
  expect(res.body.title).toBe(productUpdate.title);
});

test("POST 'URL_PRODUCT/:id/images'  should return status code 200 and res.body.lenght === 1 ", async () => {
  const imageBody = {
    url: "lorem",
    filename: "lorem",
  };

  image = await ProductImg.create(imageBody);

  const res = await request(app)
    .post(`${URL_PRODUCT}/${productId}/images`)
    .send([image.id])
    .set("Authorization", `Bearer ${TOKEN}`);

  expect(res.status).toBe(200);
  expect(res.body).toBeDefined();
  expect(res.body).toHaveLength(1);
});

test("DELETE -> 'URL_PRODUCT/:id ' should return status code 204 ", async () => {
  const res = await request(app)
    .delete(`${URL_PRODUCT}/${productId}`)
    .set("Authorization", `Bearer ${TOKEN}`);

  expect(res.statusCode).toBe(204);

  await category.destroy();
  await image.destroy();
});
