require('dotenv').config();
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const seed = require('../database/seeds/seed');
const usersData = require('../database/test-data/test-users');
const groupsData = require('../database/test-data/test-groups');
const listsData = require('../database/test-data/test-lists');
const optionsData = require('../database/test-data/test-options');

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

describe('GET /', () => {
  test('200: API health check', async () => {
    const response = await request(app.callback()).get('/');
    expect(response.status).toBe(200);
    expect(response.text).toBe('Server online!');
  });
});

describe('GET /users/:userId', () => {
  test('200: responds with user for corresponding ID', async () => {
    const testId = '6784d64b844f23ac9810cf21';

    const response = await request(app.callback()).get(`/users/${testId}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      expect.objectContaining({
        _id: '6784d64b844f23ac9810cf21',
        username: 'sparkle_unicorn',
        name: 'Sparkle Unicorn',
        email: 'sparkle@testmail.com',
        createdAt: expect.any(String),
        __v: 0,
      })
    );
  });
});

describe('GET /groups/:groupId', () => {
  test('200: responds with group for corresponding ID', async () => {
    const groupId = '6784d715844f23ac9810cf28';

    const response = await request(app.callback()).get(`/groups/${groupId}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      expect.objectContaining({
        _id: '6784d715844f23ac9810cf28',
        name: 'test_group',
        description: 'A group for all things testing',
        members: [
          '6784d64b844f23ac9810cf21',
          '6784d64b844f23ac9810cf22',
          '6784d64b844f23ac9810cf23',
        ],
        createdAt: expect.any(String),
        __v: 0,
      })
    );
  });
});
