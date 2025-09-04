import { z } from 'zod';
import { eq } from 'drizzle-orm';
import { db } from '../database/client.ts';
import { courses } from '../database/schema.ts';
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';

export const deleteCourseRote: FastifyPluginAsyncZod = async (server) => {
  server.delete(
    '/courses/:id',
    {
      schema: {
        tags: ['Cursos'],
        summary: 'Deleta um curso da base',
        description:
          'Essa rota recebe um ID e irá deletar o curso da base de dados que corresponde com esse ID',
        params: z.object({
          id: z.uuid(),
        }),
      },
    },
    async (request, reply) => {
      const courseId = request.params.id;
      const [course] = await db
        .select({ id: courses.id })
        .from(courses)
        .where(eq(courses.id, courseId));

      if (!course) {
        reply.status(404).send({ error: 'Curso não encontrado!' });
      }

      await db.delete(courses).where(eq(courses.id, courseId));

      return reply.status(200).send({ message: 'Curso removido com sucesso!' });
    },
  );
};
