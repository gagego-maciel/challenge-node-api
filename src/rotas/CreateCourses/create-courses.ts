import { z } from 'zod';
import { db } from '../../database/client.ts';
import { courses } from '../../database/schema.ts';
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';

export const createCourseRoute: FastifyPluginAsyncZod = async (server) => {
  server.post(
    '/courses',
    {
      schema: {
        tags: ['Cursos'],
        summary: 'Criar um novo curso.',
        description:
          'Essa rota recebe um titulo e uma descrição para criar um novo curso.',
        body: z.object({
          title: z.string().min(1, { message: 'O título é obrigatório' }),
          description: z.string().optional(),
        }),
        response: {
          201: z.object({
            courses: z.array(
              z.object({
                id: z.uuid(),
                title: z.string(),
                description: z.string().nullable(),
              }),
            ),
            message: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const courseId = crypto.randomUUID();
      const title = request.body.title;
      const description = request.body.description;

      const result = await db
        .insert(courses)
        .values({ id: courseId, title: title, description: description })
        .returning();

      return reply
        .status(201)
        .send({ courses: result, message: 'Criado com sucesso!' });
    },
  );
};
