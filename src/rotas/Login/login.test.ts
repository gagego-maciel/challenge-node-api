import request from 'supertest'
import { server } from '../../app.ts'
import { test, expect } from 'vitest'
import { makeUser } from '../../tests/factories/make-user.ts'
import { faker } from '@faker-js/faker'

test('should return 200 and a valid session token when credentials are correct', async () => {
  await server.ready()

  const { user, passwordBeforeHash } = await makeUser()

  const response = await request(server.server)
    .post('/sessions')
    .set('Content-type', 'application/json')
    .send({
      email: user.email,
      password: passwordBeforeHash,
    })

  expect(response.status).toEqual(200)
  expect(response.body).toEqual({
    token: expect.any(String),
    message: 'Usuário logado com sucesso!',
  })
})

test('should return 400 when email or password is incorrect', async () => {
  await server.ready()

  const response = await request(server.server)
    .post('/sessions')
    .set('Content-type', 'application/json')
    .send({
      email: faker.internet.email(),
      password: faker.internet.password(),
    })

  expect(response.status).toEqual(400)
})
