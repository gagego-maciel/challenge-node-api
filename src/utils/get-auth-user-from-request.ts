import type { FastifyRequest, FastifyReply } from 'fastify'

export function getAuthUserFromRequest(request: FastifyRequest) {
  const user = request.user

  if (!user) {
    throw new Error('Invalid authentication')
  }

  return user
}
