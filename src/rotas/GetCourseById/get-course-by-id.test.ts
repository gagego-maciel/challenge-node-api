import request from 'supertest';
import { server } from '../../app.ts';
import { test, expect } from 'vitest';
import { makeCource } from '../../tests/factories/make-course.ts';

test('get course by id', async () => {
  await server.ready();

  const course = await makeCource();
  const response = await request(server.server).get(`/courses/${course.id}`);

  expect(response.status).toEqual(200);
  expect(response.body).toEqual({
    course: {
      id: expect.any(String),
      title: expect.any(String),
      description: expect.any(String) || null,
    },
  });
});

test('return 404 for non existing courses', async () => {
  await server.ready();

  const response = await request(server.server).get(
    `/courses/e8d36d3c-1df6-4170-b3ba-779e2ec56ab3`,
  );

  expect(response.status).toEqual(404);
});
