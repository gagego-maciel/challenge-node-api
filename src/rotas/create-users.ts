import { z } from 'zod';
import { db } from '../database/client.ts';
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { users } from '../database/schema.ts';
import { hash } from 'argon2';
export const createUsersRote: FastifyPluginAsyncZod = async (server) => {
  server.post(
    '/users',
    {
      schema: {
        tags: ['Cadastro'],
        summary: 'Criar um novo usuário',
        description: 'Essa rota recebe um nome e um e-mail para cadastrar um novo usuário',
        body: z.object({
          name: z.string().min(1, { message: 'O nome é obrigatório' }),
          email: z
            .email({ message: 'E-mail inválido' })
            .min(1, { message: 'O e-mail é obrigatório' }),
          password: z.string(),
        }),
        response: {
          201: z.object({
            users: z.array(
              z.object({
                id: z.uuid(),
                name: z.string(),
                email: z.email().nullable(),
              }),
            ),
            message: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const userId = crypto.randomUUID();
      const { name, email, password } = request.body;
      const passwordHash = await hash(password);

      const result = await db
        .insert(users)
        .values({ id: userId, name, email, password: passwordHash })
        .returning();

      return reply.status(201).send({ users: result, message: 'Usuário cadastrado com sucesso!' });
    },
  );
};
