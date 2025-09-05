import type { FastifyRequest, FastifyReply } from 'fastify'
import { getAuthUserFromRequest } from '../../utils/get-auth-user-from-request'

export function checkUserRole(role: 'student' | 'manager') {
  return async function (request: FastifyRequest, reply: FastifyReply) {
    const user = getAuthUserFromRequest(request)

    if (user.role !== role) {
      return reply.status(401).send()
    }
  }
}
