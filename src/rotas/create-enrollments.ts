import { z } from 'zod';
import { db } from '../database/client.ts';
import { eq } from 'drizzle-orm';
import { enrollments, users, courses } from '../database/schema.ts';
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';

export const createEnrollmentsRoute: FastifyPluginAsyncZod = async (server) => {
  server.post(
    '/enrollments',
    {
      schema: {
        tags: ['Cadastro'],
        summary: 'Fazer uma nova matrícula em um curso',
        description:
          'Essa rota fará o cadastro de um usuário no curso escolhido',
        body: z.object({
          userId: z.uuid(),
          courseId: z.uuid(),
        }),
        response: {
          201: z.object({
            enrollment: z.object({
              user: z.object({
                id: z.uuid(),
                name: z.string(),
                email: z.email().nullable(),
              }),
              course: z.object({
                id: z.uuid(),
                title: z.string(),
              }),
              message: z.string(),
            }),
          }),
          404: z.object({
            error: z.string(),
          }),
          500: z.object({
            error: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { userId, courseId } = request.body;

      const [user] = await db.select().from(users).where(eq(users.id, userId));
      if (!user) {
        return reply.status(404).send({ error: 'Usuário não encontrado' });
      }

      const [course] = await db
        .select()
        .from(courses)
        .where(eq(courses.id, courseId));
      if (!course) {
        return reply.status(404).send({ error: 'Curso não encontrado' });
      }

      const [newEnrollment] = await db
        .insert(enrollments)
        .values({ courseId, userId })
        .returning();

      if (!newEnrollment) {
        return reply.status(500).send({ error: 'Erro ao criar matrícula' });
      }

      return reply.status(201).send({
        enrollment: {
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
          },
          course: {
            id: course.id,
            title: course.title,
          },
          message: 'Matrícula criada com sucesso!',
        },
      });
    },
  );
};
