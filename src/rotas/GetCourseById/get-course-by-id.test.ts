import request from 'supertest'
import { server } from '../../app.ts'
import { test, expect } from 'vitest'
import { makeCource } from '../../tests/factories/make-course.ts'
import { makeAuthenticatedUser } from '../../tests/factories/make-user.ts'

test('should return 200 and the course when fetching by id', async () => {
  await server.ready()

  const { token } = await makeAuthenticatedUser('student')
  const course = await makeCource()

  const response = await request(server.server)
    .get(`/courses/${course.id}`)
    .set('Authorization', `Bearer ${token}`)

  expect(response.status).toEqual(200)
  expect(response.body).toEqual({
    course: {
      id: expect.any(String),
      title: expect.any(String),
      description: expect.any(String) || null,
    },
  })
})

test('should return 404 when course is not found', async () => {
  await server.ready()
  const { token } = await makeAuthenticatedUser('student')

  const response = await request(server.server)
    .get(`/courses/e8d36d3c-1df6-4170-b3ba-779e2ec56ab3`)
    .set('Authorization', `Bearer ${token}`)

  expect(response.status).toEqual(404)
})
