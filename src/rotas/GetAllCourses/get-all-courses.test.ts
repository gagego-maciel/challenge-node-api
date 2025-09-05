import { test, expect } from 'vitest'
import request from 'supertest'
import { server } from '../../app.ts'
import { makeCource } from '../../tests/factories/make-course.ts'
import { randomUUID } from 'node:crypto'
import { makeAuthenticatedUser } from '../../tests/factories/make-user.ts'

test('get all courses', async () => {
  await server.ready()

  const titleId = randomUUID()

  await makeCource(titleId)

  const { token } = await makeAuthenticatedUser('student')

  const response = await request(server.server)
    .get(`/courses?search=${titleId}`)
    .set('Authorization', `Bearer ${token}`)

  expect(response.status).toEqual(200)
  expect(response.body).toEqual({
    total: 1,
    courses: [
      {
        id: expect.any(String),
        title: titleId,
        description: expect.any(String),
        enrollments: 0,
      },
    ],
  })
})
