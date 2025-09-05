import { z } from 'zod'
import { eq } from 'drizzle-orm'
import { db } from '../../database/client.ts'
import { courses } from '../../database/schema.ts'
import { checkRequestJWT } from '../hooks/check-request-jwt.ts'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { getAuthUserFromRequest } from '../../utils/get-auth-user-from-request.ts'

export const getCourseByIdRoute: FastifyPluginAsyncZod = async (server) => {
  server.get(
    '/courses/:id',
    {
      preHandler: [checkRequestJWT],
      schema: {
        tags: ['Cursos'],
        summary: 'Busca um curso pelo id',
        description: 'Essa rota recebe um ID e retorna o curso desse ID',
        params: z.object({
          id: z.uuid(),
        }),
        response: {
          200: z.object({
            course: z.object({
              id: z.uuid(),
              title: z.string(),
              description: z.string().nullable(),
            }),
          }),
          404: z.object({
            error: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const user = getAuthUserFromRequest(request)
      const courseId = request.params.id
      const [course] = await db.select().from(courses).where(eq(courses.id, courseId))

      if (!course) {
        return reply.status(404).send({ error: 'Curso não encontrado!' })
      }

      return { course }
    },
  )
}
