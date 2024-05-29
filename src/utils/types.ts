import { RegisterUserResponse } from '../modules/user/schema'
import { JWT } from '@fastify/jwt'

// A Generic API response type
export interface Response<T> {
  code: number
  error?: string
  data?: T
}

// Required for JWT and Fastify to work in Typescript
declare module 'fastify' {
  interface FastifyRequest {
    jwt: JWT
  }
  export interface FastifyInstance {
    authentication: any
  }
}
declare module '@fastify/jwt' {
  interface FastifyJWT {
    user: RegisterUserResponse
  }
}
