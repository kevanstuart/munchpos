import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import { FastifyJWT } from '@fastify/jwt'

import { listUsers, loginUser, registerUser } from './controller'
import { UserInput, userSchemas, $ref } from './schema'
import { config } from '../../config/constants'

async function registerHandler (
  request: FastifyRequest<{ Body: UserInput }>,
  reply: FastifyReply
): Promise<void> {
  const result = await registerUser(request.body)
  await reply.code(result.code).send(result.data ?? result.error)
}

async function loginHandler (
  request: FastifyRequest<{ Body: UserInput }>,
  reply: FastifyReply
): Promise<void> {
  const result = await loginUser(request.body, request.jwt)

  if (result.error === undefined && result.data !== undefined) {
    await reply
      .setCookie(
        'access_token',
        result.data.accessToken,
        {
          path: '/',
          httpOnly: true,
          maxAge: config.cookie_max_age
        }
      )
      .code(200)
      .send(result.data)
  } else {
    await reply.code(result.code).send(result.error)
  }
}

async function logoutHandler (
  _: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  await reply
    .clearCookie('access_token')
    .code(200)
    .send('Logout successful')
}

export async function authUser (
  request: FastifyRequest<{ Body: UserInput }>,
  reply: FastifyReply
): Promise<void> {
  const token = request.cookies.access_token
  if (token === null || token === undefined) {
    await reply.status(401).send('This is a protected route. Please login')
  } else {
    const decoded = request.jwt.verify<FastifyJWT['user']>(token)
    request.user = decoded
  }
}

async function userHandler (
  _: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  const result = await listUsers()
  await reply.code(result.code).send(result.data ?? result.error)
}

export async function userRoutes (app: FastifyInstance): Promise<void> {
  for (const schema of [...userSchemas]) {
    app.addSchema(schema)
  }

  app.post('/register', {
    schema: {
      body: $ref('userInput'),
      response: {
        201: $ref('registerResponse'),
        '4xx': { type: 'string' },
        500: { type: 'string' }
      }
    }
  }, registerHandler)

  app.post('/login', {
    schema: {
      body: $ref('userInput'),
      response: {
        201: $ref('loginResponse'),
        '4xx': { type: 'string' },
        500: { type: 'string' }
      }
    }
  }, loginHandler)

  app.post('/logout', {
    preHandler: [app.authentication]
  }, logoutHandler)

  // Used as a test for the authentication
  app.get('/', {
    preHandler: [app.authentication],
    schema: {
      response: {
        200: $ref('listResponse'),
        401: { type: 'string' }
      }
    }
  }, userHandler)
}
