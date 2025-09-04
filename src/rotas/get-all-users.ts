import { z } from 'zod';
import { ilike, asc, type SQL, and } from 'drizzle-orm';
import { db } from '../database/client.ts';
import { users } from '../database/schema.ts';
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';

export const getAllUsersRote: FastifyPluginAsyncZod = async (server) => {
  server.get(
    '/users',
    {
      schema: {
        tags: ['Cadastro'],
        summary: 'Lista todos os usuários.',
        description: 'Essa rota vai listar todos os usuários da base.',
        querystring: z.object({
          search: z.string().optional(),
          orderBy: z.enum(['name', 'email']).optional().default('name'),
          page: z.coerce.number().optional().default(1),
        }),
        response: {
          200: z.object({
            users: z.array(
              z.object({
                id: z.uuid(),
                name: z.string(),
                email: z.email().nullable(),
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
        conditions.push(ilike(users.name, `%${search}%`));
      }

      const [result, total] = await Promise.all([
        db
          .select()
          .from(users)
          .orderBy(asc(users[orderBy]))
          .offset((page - 1) * 2)
          .limit(3)
          .where(and(...conditions)),
        db.$count(users, and(...conditions)),
      ]);

      return reply.send({ users: result, total });
    },
  );
};
