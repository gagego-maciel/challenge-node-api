import { test, expect } from 'vitest';
import request from 'supertest';
import { server } from '../../app.ts';
import { fakerPT_BR as faker } from '@faker-js/faker';

test('should return 201 and the created course when request body is valid', async () => {
  await server.ready();

  const uniqueTitle = `TEST-${faker.string.uuid()}`;
  const uniqueDescription = `Desc-${faker.string.uuid()}`;

  const response = await request(server.server)
    .post('/courses')
    .set('Content-type', 'application/json')
    .send({ title: uniqueTitle, description: uniqueDescription });

  expect(response.status).toEqual(201);
  expect(response.body).toEqual({
    message: expect.any(String),
    courses: [
      {
        id: expect.any(String),
        title: expect.any(String),
        description: expect.any(String),
      },
    ],
  });
});
