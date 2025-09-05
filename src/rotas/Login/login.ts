import { z } from 'zod'
import { db } from '../../database/client.ts'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { users } from '../../database/schema.ts'
import { verify } from 'argon2'
import { eq } from 'drizzle-orm'
import jwt from 'jsonwebtoken'

export const loginRote: FastifyPluginAsyncZod = async (server) => {
  server.post(
    '/sessions',
    {
      schema: {
        tags: ['Auth'],
        summary: 'Rota de autenticação',
        description:
          'Essa rota recebe um e-mail e password para que o usuário posso se autenticar ao sistema',
        body: z.object({
          email: z.email({ message: 'E-mail inválido' }),
          password: z.string(),
        }),
        response: {
          200: z.object({
            token: z.string(),
            message: z.string(),
          }),
          400: z.object({
            message: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const invalidCredential = 'Credenciais inválidas!'
      const { email, password } = request.body
      const result = await db.select().from(users).where(eq(users.email, email))

      if (result.length === 0) {
        return reply.status(400).send({ message: invalidCredential })
      }

      const user = result[0]
      const doesPasswordMatch = await verify(user.password, password)

      if (!doesPasswordMatch) {
        return reply.status(400).send({ message: invalidCredential })
      }

      const token = jwt.sign({ sub: user.id, role: user.role }, process.env.JWT_SECRET || '')

      return reply.status(200).send({ token, message: 'Usuário logado com sucesso!' })
    },
  )
}
