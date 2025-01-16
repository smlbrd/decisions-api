require('dotenv').config();
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const seed = require('../database/seeds/seed');
const usersData = require('../database/test-data/test-users');
const groupsData = require('../database/test-data/test-groups');
const listsData = require('../database/test-data/test-lists');
const optionsData = require('../database/test-data/test-options');
const decisionsData = require('../database/test-data/test-decisions');
const Option = require('../models/options.model');
const fs = require('fs/promises');

const uri = process.env.DATABASE_URI;

beforeAll(async () => {
  await mongoose.connect(uri);
});

beforeEach(async () => {
  await seed(usersData, groupsData, listsData, optionsData, decisionsData);
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

describe('GET /api', () => {
  test('200: serves the endpoints.json file', async () => {
    const endpoints = await fs.readFile(
      `${__dirname}/../endpoints.json`,
      'UTF8'
    );
    const response = await request(app.callback()).get('/api');
    expect(response.status).toBe(200);
    expect(response.body).toEqual(JSON.parse(endpoints));
  });
});

describe('GET /users/:userId', () => {
  test('200: responds with user for corresponding user ID', async () => {
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
  test('404: responds with error if cannot match user ID', async () => {
    const invalidId = '00000a00000b00000c00000d';

    const response = await request(app.callback()).get(`/users/${invalidId}`);

    expect(response.status).toBe(404);
    expect(response.body.error).toBe('No results!');
  });
});

describe('GET /users/:userId/saved_lists', () => {
  test('200: responds with a populated array of lists based on user ID', async () => {
    const userId = '6784d64b844f23ac9810cf21';

    await request(app.callback())
      .get(`/users/${userId}/saved_lists`)
      .expect(200)
      .then(({ body }) => {
        expect(body.length).toBe(1);
        expect(body[0]._id).toBe('6784d7a5844f23ac9810cf30');
        expect(body[0].title).toBe('Weekly Standup');
        expect(body[0].owner).toBe('6784d64b844f23ac9810cf21');
      });
  });
});

describe('GET /groups/:groupId', () => {
  test('200: responds with group for corresponding group ID', async () => {
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

describe('GET /groups/:groupId/members', () => {
  test('200: responds with an array of members for corresponding group ID', async () => {
    const groupId = '6784d715844f23ac9810cf28';

    await request(app.callback())
      .get(`/groups/${groupId}/members`)
      .expect(200)
      .then(({ body }) => {
        expect(body.length).toBe(3);
        expect(body[0]._id).toBe('6784d64b844f23ac9810cf21');
        expect(body[1]._id).toBe('6784d64b844f23ac9810cf22');
        expect(body[2]._id).toBe('6784d64b844f23ac9810cf23');
      });
  });
});

describe('POST /groups', () => {
  test('201: responds with newly posted group', async () => {
    const testGroup = {
      _id: '6784d715844f23ac90876222',
      name: 'good_gardeners',
      description: 'A group for good gardening',
      members: [
        { _id: '6784d64b844f23ac9810cf24' },
        { _id: '6784d64b844f23ac9810cf25' },
        { _id: '6784d64b844f23ac9810cf26' },
      ],
    };
    const response = await request(app.callback())
      .post('/groups')
      .send(testGroup);
    expect(response.status).toBe(201);
    expect(response.body).toEqual(
      expect.objectContaining({
        _id: '6784d715844f23ac90876222',
        name: 'good_gardeners',
        description: 'A group for good gardening',
        members: [
          '6784d64b844f23ac9810cf24',
          '6784d64b844f23ac9810cf25',
          '6784d64b844f23ac9810cf26',
        ],
        createdAt: expect.any(String),
        __v: 0,
      })
    );
  });
});

describe('GET /lists/:listId', () => {
  test('200: responds with a list for corresponding list ID', async () => {
    const listId = '6784d7a5844f23ac9810cf30';
    await request(app.callback())
      .get(`/lists/${listId}`)
      .expect(200)
      .then(({ body }) => {
        expect(body._id).toBe('6784d7a5844f23ac9810cf30');
        expect(body.title).toBe('Weekly Standup');
        expect(body.description).toBe(
          'A list for organizing weekly standup meetings'
        );
        expect(body.options.length).toBe(2);
        expect(typeof body.options[0].name).toBe('string');
        expect(typeof body.options[1].name).toBe('string');
        expect(body.owner).toBe('6784d64b844f23ac9810cf21');
      });
  });
  test('404: responds with error if cannot match list ID', async () => {
    const invalidId = '00000a00000b00000c00000d';
    await request(app.callback())
      .get(`/lists/${invalidId}`)
      .expect(404)
      .then(({ body: { error } }) => {
        expect(error).toBe('No results!');
      });
  });
});

describe('POST /lists', () => {
  test('201: responds with newly posted list', async () => {
    const testList = {
      _id: '6784d7a5844f23ac9810ca45',
      title: 'Gardening',
      description: 'A list of the best new gardening tools',
      options: ['6784d7b5844f23ac9810cf34', '6784d7b5844f23ac9810cf35'],
      owner: '6784d64b844f23ac9810cf24',
      members: ['6784d64b844f23ac9810cf25', '6784d64b844f23ac9810cf26'],
    };

    const response = await request(app.callback())
      .post('/lists')
      .send(testList);

    expect(response.status).toBe(201);
    expect(response.body).toEqual(
      expect.objectContaining({
        title: 'Gardening',
        description: 'A list of the best new gardening tools',
        options: ['6784d7b5844f23ac9810cf34', '6784d7b5844f23ac9810cf35'],
        owner: '6784d64b844f23ac9810cf24',
        members: ['6784d64b844f23ac9810cf25', '6784d64b844f23ac9810cf26'],
        createdAt: expect.any(String),
        _id: '6784d7a5844f23ac9810ca45',
        __v: 0,
      })
    );
  });
});

describe('PUT /groups/:group_id', () => {
  test('200: edits a group and responds with the updated group', async () => {
    const groupId = '6784d715844f23ac9810cf28';
    const newDescription = {
      name: 'Gardens',
      description: 'A club for anyone who gardens in their garden.',
      owner: ['6784d64b844f23ac9810cf21'],
      members: [
        { _id: '6784d64b844f23ac9810cf21' },
        { _id: '6784d64b844f23ac9810cf22' },
        { _id: '6784d64b844f23ac9810cf23' },
      ],
    };

    const response = await request(app.callback())
      .put(`/groups/${groupId}`)
      .send(newDescription);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      _id: '6784d715844f23ac9810cf28',
      name: 'Gardens',
      description: 'A club for anyone who gardens in their garden.',
      owner: ['6784d64b844f23ac9810cf21'],
      members: [
        '6784d64b844f23ac9810cf21',
        '6784d64b844f23ac9810cf22',
        '6784d64b844f23ac9810cf23',
      ],
      createdAt: expect.any(String),
      __v: 0,
    });
  });
  test('404: responds with an error if PUT path is to an invalid groupId', async () => {
    const invalidGroupId = '00000a00000b00000c00000d';

    const newDescription = {
      name: 'Gardens',
      description: 'A club for anyone who gardens in their garden.',
      members: [
        { _id: '6784d64b844f23ac9810cf21' },
        { _id: '6784d64b844f23ac9810cf22' },
        { _id: '6784d64b844f23ac9810cf23' },
      ],
    };

    const response = await request(app.callback())
      .put(`/groups/${invalidGroupId}`)
      .send(newDescription);

    expect(response.status).toBe(404);
    expect(response.body.error).toBe('Put unsuccessful');
  });
});

describe('DELETE /groups/:groupId', () => {
  test('204: deletes group by groupId', async () => {
    const groupId = '6784d715844f23ac9810cf28';

    const response = await request(app.callback()).delete(`/groups/${groupId}`);

    expect(response.status).toBe(204);
  });
  test('404: responds with an error message for invalid groupId', async () => {
    const invalidId = '00000a00000b00000c00000d';

    const response = await request(app.callback()).delete(
      `/groups/${invalidId}`
    );

    expect(response.status).toBe(404);
    expect(response.body.error).toBe('Group Not Found');
  });
});

describe('Error handling middleware', () => {
  test('404: responds with an error message for invalid route', async () => {
    const response = await request(app.callback()).get(
      '/non-existent-endpoint'
    );
    expect(response.status).toBe(404);
    expect(response.text).toBe('Not Found');
  });
});

describe('PUT /users/:userId', () => {
  test('200: responds with updated user information for corresponding user ID', async () => {
    const testId = '6784d64b844f23ac9810cf21';
    const userUpdate = {
      username: 'sparkle_unicorn 10',
      name: 'No more unicorns',
      email: 'sparkles@testmail.com',
    };
    const response = await request(app.callback())
      .put(`/users/${testId}`)
      .send(userUpdate);
    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      expect.objectContaining({
        _id: '6784d64b844f23ac9810cf21',
        username: 'sparkle_unicorn 10',
        name: 'No more unicorns',
        email: 'sparkles@testmail.com',
        createdAt: expect.any(String),
        __v: 0,
      })
    );
  });
  test('404: responds with error if cannot match user ID', async () => {
    const invalidId = '00000a00000b00000c00000d';
    const userUpdate = {
      username: 'sparkle_unicorn 10',
      name: 'No more unicorns',
      email: 'sparkles@testmail.com',
    };
    const response = await request(app.callback())
      .put(`/users/${invalidId}`)
      .send(userUpdate);
    expect(response.status).toBe(404);
    expect(response.body.error).toBe('User not found');
  });
});

describe('POST: /decisions', () => {
  test('201: successfully posts a voting process and responds with the newly posted voting process ', async () => {
    const testDecision = {
      _id: '6784d7c5844f23ac9810cf38',
      list: '6784d7a5844f23ac9810cf33',
      group: '6784d715844f23ac9810cf28',
      votes: [
        {
          user: '6784d64b844f23ac9810cf24',
          option: '6784d7b5844f23ac9810cf34',
        },
        {
          user: '6784d64b844f23ac9810cf25',
          option: '6784d7b5844f23ac9810cf35',
        },
        {
          user: '6784d64b844f23ac9810cf26',
          option: '6784d7b5844f23ac9810cf34',
        },
      ],
      votingStatus: 'open',
    };

    const response = await request(app.callback())
      .post('/decisions')
      .send(testDecision);
    expect(response.status).toBe(201);
    expect(response.body).toEqual(
      expect.objectContaining({
        _id: '6784d7c5844f23ac9810cf38',
        list: '6784d7a5844f23ac9810cf33',
        group: '6784d715844f23ac9810cf28',
        votes: [
          expect.objectContaining({
            user: '6784d64b844f23ac9810cf24',
            option: '6784d7b5844f23ac9810cf34',
            createdAt: expect.any(String),
          }),
          expect.objectContaining({
            user: '6784d64b844f23ac9810cf25',
            option: '6784d7b5844f23ac9810cf35',
            createdAt: expect.any(String),
          }),
          expect.objectContaining({
            user: '6784d64b844f23ac9810cf26',
            option: '6784d7b5844f23ac9810cf34',
            createdAt: expect.any(String),
          }),
        ],
        votingStatus: 'open',
        __v: 0,
        createdAt: expect.any(String),
      })
    );
  });
});

describe('PUT /lists/:listId', () => {
  test('200: responds with updated list information for corresponding list ID', async () => {
    const testId = '6784d7a5844f23ac9810cf30';
    const listUpdate = {
      title: 'Weekly Standup Test',
      description: 'A test list update',
      options: ['6784d7b5844f23ac9810cf31', '6784d7b5844f23ac9810cf32'],
      owner: '6784d64b844f23ac9810cf21',
      members: ['6784d64b844f23ac9810cf22', '6784d64b844f23ac9810cf23'],
    };
    const response = await request(app.callback())
      .put(`/lists/${testId}`)
      .send(listUpdate);
    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      expect.objectContaining({
        _id: '6784d7a5844f23ac9810cf30',
        title: 'Weekly Standup Test',
        description: 'A test list update',
        options: ['6784d7b5844f23ac9810cf31', '6784d7b5844f23ac9810cf32'],
        owner: '6784d64b844f23ac9810cf21',
        members: ['6784d64b844f23ac9810cf22', '6784d64b844f23ac9810cf23'],
        __v: 0,
      })
    );
  });
  test('404: responds with error if cannot match user ID', async () => {
    const invalidId = '00000a00000b00000c00000d';
    const listUpdate = {
      title: 'Weekly Standup Test',
      description: 'A test list update',
      options: ['6784d7b5844f23ac9810cf31', '6784d7b5844f23ac9810cf32'],
      owner: '6784d64b844f23ac9810cf21',
      members: ['6784d64b844f23ac9810cf22', '6784d64b844f23ac9810cf23'],
    };
    const response = await request(app.callback())
      .put(`/lists/${invalidId}`)
      .send(listUpdate);
    expect(response.status).toBe(404);
    expect(response.body.error).toBe('List not found');
  });
});
describe('DELETE /lists/:listId', () => {
  test('204: deletes list by listId', async () => {
    const listId = '6784d7a5844f23ac9810cf30';

    const response = await request(app.callback()).delete(`/lists/${listId}`);

    expect(response.status).toBe(204);
  });
  test('404: responds with an error message for invalid listId', async () => {
    const invalidId = '00000a00000b00000c00000d';

    const response = await request(app.callback()).delete(
      `/lists/${invalidId}`
    );

    expect(response.status).toBe(404);
    expect(response.body.error).toBe('List Not Found');
  });
});

describe('POST /users', () => {
  test('201: posts a new user and returns that new user', async () => {
    const testUser = {
      _id: '6784d64b844f23ac9810cf27',
      username: 'huge_hippo',
      name: 'Hugo Hippo',
      email: 'hugohipster@testmail.com',
    };

    const response = await request(app.callback())
      .post('/users')
      .send(testUser);

    expect(response.status).toBe(201);
    expect(response.body).toEqual(
      expect.objectContaining({
        _id: '6784d64b844f23ac9810cf27',
        username: 'huge_hippo',
        name: 'Hugo Hippo',
        email: 'hugohipster@testmail.com',
        savedLists: [],
        __v: 0,
        createdAt: expect.any(String),
      })
    );
  });
});

describe('POST /lists/:listId/options', () => {
  test('200: responds with modified list with option addedclear', async () => {
    const listId = '6784d7a5844f23ac9810cf30';
    const testOption = {
      name: "Alex option 6",
      description: 'Alex option for this list6',
      customFields: ['time investment: 40 mins', 'mood: relax'],
    };

    const response = await request(app.callback())
      .post(`/lists/${listId}/options`)
      .send(testOption);

    expect(response.status).toBe(200);
    expect(response.body.options.length).toBe(3);
    expect(response.body).toEqual(
      expect.objectContaining({
        title: 'Weekly Standup',
        description: 'A list for organizing weekly standup meetings',
        owner: '6784d64b844f23ac9810cf21',
        createdAt: expect.any(String),
        _id: expect.any(String),
        __v: 0,
      })
    );

  });
  test('404: responds with 404 error if invalid ListId', async () => {
    const listId = '00000a00000b00000c00000d';
    const testOption = {
      name: "Alex option 6",
      description: 'Alex option for this list6',
      customFields: ['time investment: 40 mins', 'mood: relax'],
    };

    const response = await request(app.callback())
      .post(`/lists/${listId}/options`)
      .send(testOption);

    expect(response.status).toBe(404);
    expect(response.body.error).toBe('List Not Found');

  });
});

describe('DELETE /lists/:listId/options/:optionId', () => {
  test('204: deletes option by optionId', async () => {
    const optionId = '6784d7b5844f23ac9810cf31';

    const listId = '6784d7a5844f23ac9810cf30';

    const response = await request(app.callback()).delete(
      `/lists/${listId}/options/${optionId}`
    );

    expect(response.status).toBe(204);

    const deletedOption = await Option.findById(optionId);
    expect(deletedOption).toBeNull();
  });
  test('404: responds with error message for invalid optionId', async () => {
    const invalidId = '00000a00000b00000c00000d';

    const listId = '6784d7a5844f23ac9810cf30';

    const response = await request(app.callback()).delete(
      `/lists/${listId}/options/${invalidId}`
    );

    expect(response.status).toBe(404);
    expect(response.body.error).toBe('Option Not Found');
  });
});
describe.only('DELETE /users/:userId/', () => {
  test('204: deletes user by userId', async () => {
    const userId = '6784d7b5844f23ac9810cf31';

    const response = await request(app.callback()).delete(
      `/users/${userId}`
    );

    expect(response.status).toBe(204);

    const deletedUser = await User.findById(userId);
    expect(deletedUser).toBeNull();
  });
  test('404: responds with error message for invalid userId', async () => {
    const invalidId = '00000a00000b00000c00000d';

    const response = await request(app.callback()).delete(
      `/users/${invalidId}`
    );

    expect(response.status).toBe(404);
    expect(response.body.error).toBe('User Not Found');
  });
});
