import { z } from 'zod';
import { eq } from 'drizzle-orm';
import { db } from '../../database/client.ts';
import { ilike, asc, type SQL, and, count } from 'drizzle-orm';
import { courses, enrollments } from '../../database/schema.ts';
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';

export const getAllCoursesRoute: FastifyPluginAsyncZod = async (server) => {
  server.get(
    '/courses',
    {
      schema: {
        tags: ['Cursos'],
        summary: 'Lista todos os cursos existentes.',
        description:
          'Essa rota vai listar todos os cursos criados existentes na base de dados.',
        querystring: z.object({
          search: z.string().optional(),
          orderBy: z.enum(['id', 'title']).optional().default('id'),
          page: z.coerce.number().optional().default(1),
        }),
        response: {
          200: z.object({
            courses: z.array(
              z.object({
                id: z.uuid(),
                title: z.string(),
                description: z.string().nullable(),
                enrollments: z.number(),
              }),
            ),
            total: z.number(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { search, orderBy, page } = request.query;

      const conditions: SQL[] = [];

      if (search) {
        conditions.push(ilike(courses.title, `%${search}%`));
      }

      const [result, total] = await Promise.all([
        db
          .select({
            id: courses.id,
            title: courses.title,
            description: courses.description,
            enrollments: count(enrollments.id),
          })
          .from(courses)
          .leftJoin(enrollments, eq(enrollments.courseId, courses.id))
          .orderBy(asc(courses[orderBy]))
          .offset((page - 1) * 2)
          .limit(10)
          .where(and(...conditions))
          .groupBy(courses.id),
        db.$count(courses, and(...conditions)),
      ]);

      return reply.send({ courses: result, total });
    },
  );
};
