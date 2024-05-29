import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import {
  createProductUpsell,
  getProductUpsell,
  removeProductUpsell
} from './controller'
import {
  CreateUpsellInput,
  GetUpsellParams,
  RemoveUpsellParams,
  upsellSchemas,
  $ref
} from './schema'

async function createUpsellHandler (
  request: FastifyRequest<{ Body: CreateUpsellInput }>,
  reply: FastifyReply
): Promise<void> {
  const result = await createProductUpsell(request.body)
  await reply.code(result.code).send(result.data ?? result.error)
}

async function getUpsellHandler (
  request: FastifyRequest<{ Params: GetUpsellParams }>,
  reply: FastifyReply
): Promise<void> {
  const result = await getProductUpsell(request.params.productId)
  await reply.code(result.code).send(result.data ?? result.error)
}

async function deleteUpsellHandler (
  request: FastifyRequest<{ Params: RemoveUpsellParams }>,
  reply: FastifyReply
): Promise<void> {
  const { productId, upsellId } = request.params
  const result = await removeProductUpsell(productId, upsellId)
  await reply.code(result.code).send(result.data ?? result.error)
}

export async function upsellRoutes (app: FastifyInstance): Promise<void> {
  for (const schema of [...upsellSchemas]) {
    app.addSchema(schema)
  }

  app.post('/', {
    preHandler: [app.authentication],
    schema: {
      body: $ref('createUpsellInput'),
      response: {
        201: { type: 'null' },
        '4xx': { type: 'string' },
        500: { type: 'string' }
      }
    }
  }, createUpsellHandler)

  app.get('/:productId', {
    preHandler: [app.authentication],
    schema: {
      params: $ref('getUpsellParams'),
      response: {
        200: $ref('getUpsellResponse'),
        401: { type: 'string' },
        500: { type: 'string' }
      }
    }
  }, getUpsellHandler)

  app.delete('/:productId/:upsellId', {
    preHandler: [app.authentication],
    schema: {
      params: $ref('removeUpsellParams'),
      response: {
        204: { type: 'null' },
        '4xx': { type: 'string' },
        500: { type: 'string' }
      }
    }
  }, deleteUpsellHandler)
}
