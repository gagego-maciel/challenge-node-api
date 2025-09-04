import fastify from 'fastify';
import { fastifySwagger } from '@fastify/swagger';
import { fastifySwaggerUi } from '@fastify/swagger-ui';
import { deleteCourseRote } from './rotas/delete-course.ts';
import { createCourseRoute } from './rotas/CreateCourses/create-courses.ts';
import { getAllCoursesRoute } from '../src/rotas/GetAllCourses/get-all-courses.ts';
import { getCourseByIdRoute } from './rotas/GetCourseById/get-course-by-id.ts';
import { createUsersRote } from './rotas/create-users.ts';
import { getAllUsersRote } from './rotas/get-all-users.ts';
import { createEnrollmentsRoute } from './rotas/create-enrollments.ts';
import {
  validatorCompiler,
  serializerCompiler,
  type ZodTypeProvider,
  jsonSchemaTransform,
} from 'fastify-type-provider-zod';

const server = fastify().withTypeProvider<ZodTypeProvider>();

server.register(fastifySwagger, {
  openapi: {
    info: {
      title: 'Desafio Node.js',
      version: '1.0.0',
    },
  },
  transform: jsonSchemaTransform,
});

server.register(fastifySwaggerUi, {
  routePrefix: '/docs',
});

server.setSerializerCompiler(serializerCompiler);
server.setValidatorCompiler(validatorCompiler);

server.register(getAllCoursesRoute);
server.register(getCourseByIdRoute);
server.register(createCourseRoute);
server.register(deleteCourseRote);
server.register(createUsersRote);
server.register(getAllUsersRote);
server.register(createEnrollmentsRoute);

export { server };
