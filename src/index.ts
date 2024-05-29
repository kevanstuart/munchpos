import Fastify, { FastifyInstance } from 'fastify'
import cookie from '@fastify/cookie'
import fastifyHelmet from '@fastify/helmet'
import cors from '@fastify/cors'
import jwt from '@fastify/jwt'

import { transactionRoutes } from './modules/transaction/routes'
import { authUser, userRoutes } from './modules/user/routes'
import { productRoutes } from './modules/product/routes'
import { config } from './config/constants'
import { upsellRoutes } from './modules/upsell/routes'

export const main = function (options = {}): FastifyInstance {
  const application = Fastify(options)

  void application.register(jwt, { secret: config.jwt_secret })
  void application.decorate('authentication', authUser)

  application.addHook('preHandler', (req, _, next) => {
    req.jwt = application.jwt
    return next()
  })

  void application.register(cookie, {
    secret: config.jwt_secret,
    hook: 'preHandler'
  })

  /**
   * This is not a proper setup of CORS, just
   * an indication that it should be used for
   * a production environment
   */
  void application.register(cors, {
    origin: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
  })

  /**
   * Again, this is not a proper setup of Helmet
   * (a security feature for headers), just an
   * indication that it should be used for a
   * production environment
   */
  void application.register(fastifyHelmet)

  void application.register(userRoutes, { prefix: 'users' })
  void application.register(productRoutes, { prefix: 'products' })
  void application.register(transactionRoutes, { prefix: 'transactions' })
  void application.register(upsellRoutes, { prefix: 'upsell' })

  return application
}
