require("dotenv").config();
const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../app");
const seed = require("../database/seeds/seed");
const usersData = require("../database/test-data/test-users");
const groupsData = require("../database/test-data/test-groups");
const listsData = require("../database/test-data/test-lists");
const optionsData = require("../database/test-data/test-options");

const uri = process.env.DATABASE_URI;

beforeAll(async () => {
  await mongoose.connect(uri);
});

beforeEach(async () => {
  await seed(usersData, groupsData, listsData, optionsData);
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("GET /", () => {
  test("200: API health check", async () => {
    const response = await request(app.callback()).get("/");
    expect(response.status).toBe(200);
    expect(response.text).toBe("Server online!");
  });
});

describe("GET /users/:userId", () => {
  test("200: responds with user for corresponding ID", async () => {
    const testId = "6784d64b844f23ac9810cf21";

    const response = await request(app.callback()).get(`/users/${testId}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      expect.objectContaining({
        _id: "6784d64b844f23ac9810cf21",
        username: "sparkle_unicorn",
        name: "Sparkle Unicorn",
        email: "sparkle@testmail.com",
        createdAt: expect.any(String),
        __v: 0,
      })
    );
  });
});

describe("GET /groups/:groupId", () => {
  test("200: responds with group for corresponding ID", async () => {
    const groupId = "6784d715844f23ac9810cf28";

    const response = await request(app.callback()).get(`/groups/${groupId}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      expect.objectContaining({
        _id: "6784d715844f23ac9810cf28",
        name: "test_group",
        description: "A group for all things testing",
        members: [
          "6784d64b844f23ac9810cf21",
          "6784d64b844f23ac9810cf22",
          "6784d64b844f23ac9810cf23",
        ],
        createdAt: expect.any(String),
        __v: 0,
      })
    );
  });
});


describe("POST /groups", () => {
  test("201: responds with newly posted group", async () => {
    const testGroup = {
      _id: "6784d715844f23ac90876222",
      name: "good_gardeners",
      description: "A group for good gardening",
      members: [
        { _id: "6784d64b844f23ac9810cf24" },
        { _id: "6784d64b844f23ac9810cf25" },
        { _id: "6784d64b844f23ac9810cf26" },
      ],
    };
    const response = await request(app.callback())
      .post("/groups")
      .send(testGroup);
    expect(response.status).toBe(201);
    expect(response.body).toEqual(
      expect.objectContaining({
        _id: "6784d715844f23ac90876222",
        name: "good_gardeners",
        description: "A group for good gardening",
        members: [
          "6784d64b844f23ac9810cf24",
          "6784d64b844f23ac9810cf25",
          "6784d64b844f23ac9810cf26",
        ],
        createdAt: expect.any(String),
        __v: 0,
      })
    );
  });
});

describe("POST /lists", () => {
  test("201: responds with newly posted list", async () => {
    const testList = {
      _id: "6784d7a5844f23ac9810ca45",
      title: "Gardening",
      description: "A list of the best new gardening tools",
      options: ["6784d7b5844f23ac9810cf34", "6784d7b5844f23ac9810cf35"],
      owner: "6784d64b844f23ac9810cf24",
      members: ["6784d64b844f23ac9810cf25", "6784d64b844f23ac9810cf26"],
    };

    const response = await request(app.callback())
      .post("/lists")
      .send(testList);

    expect(response.status).toBe(201);
    expect(response.body).toEqual(
      expect.objectContaining({
        title: "Gardening",
        description: "A list of the best new gardening tools",
        options: ["6784d7b5844f23ac9810cf34", "6784d7b5844f23ac9810cf35"],
        owner: "6784d64b844f23ac9810cf24",
        members: ["6784d64b844f23ac9810cf25", "6784d64b844f23ac9810cf26"],
        createdAt: expect.any(String),
        _id: "6784d7a5844f23ac9810ca45",
        __v: 0,
      })
    );

describe('Error handling middleware', () => {
  test('404: responds with an error message for invalid route', async () => {
    const response = await request(app.callback()).get(
      '/non-existent-endpoint'
    );
    console.log(response);
    expect(response.status).toBe(404);
    expect(response.text).toBe('Not Found');
  });
});
