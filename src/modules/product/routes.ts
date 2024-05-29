import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import {
  listProducts,
  createProduct,
  deleteProduct,
  updateProduct
} from './controller'
import {
  CreateProductInput,
  UpdateProductInput,
  SingleProductParam,
  productSchemas,
  $ref
} from './schema'

async function createProductHandler (
  request: FastifyRequest<{ Body: CreateProductInput }>,
  reply: FastifyReply
): Promise<void> {
  const result = await createProduct(request.body)
  await reply.code(result.code).send(result.data ?? result.error)
}

async function updateProductHandler (
  request: FastifyRequest<{ Body: UpdateProductInput }>,
  reply: FastifyReply
): Promise<void> {
  const result = await updateProduct(request.body)
  await reply.code(result.code).send(result.data ?? result.error)
}

async function listProductHandler (
  _: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  const result = await listProducts()
  await reply.code(result.code).send(result.data ?? result.error)
}

async function deleteProductHandler (
  request: FastifyRequest<{ Params: SingleProductParam }>,
  reply: FastifyReply
): Promise<void> {
  const result = await deleteProduct(request.params.productId)
  await reply.code(result.code).send(null)
}

export async function productRoutes (app: FastifyInstance): Promise<void> {
  for (const schema of [...productSchemas]) {
    app.addSchema(schema)
  }

  app.post('/', {
    preHandler: [app.authentication],
    schema: {
      body: $ref('createProductInput'),
      response: {
        201: $ref('upsertProductResponse'),
        '4xx': { type: 'string' },
        500: { type: 'string' }
      }
    }
  }, createProductHandler)

  app.put('/', {
    preHandler: [app.authentication],
    schema: {
      body: $ref('updateProductInput'),
      response: {
        201: $ref('upsertProductResponse'),
        '4xx': { type: 'string' },
        500: { type: 'string' }
      }
    }
  }, updateProductHandler)

  app.delete('/:productId', {
    preHandler: [app.authentication],
    schema: {
      params: $ref('singleProductParam'),
      response: {
        204: { type: 'null' },
        '4xx': { type: 'string' },
        500: { type: 'string' }
      }
    }
  }, deleteProductHandler)

  app.get('/', {
    preHandler: [app.authentication],
    schema: {
      response: {
        200: $ref('listProductResponse'),
        401: { type: 'string' },
        500: { type: 'string' }
      }
    }
  }, listProductHandler)
}
