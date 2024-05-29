import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import { CreateTransactionInput, transactionSchemas, $ref } from './schema'
import { createTransaction, getTransaction } from './controller'

async function createTransactionHandler (
  request: FastifyRequest<{ Body: CreateTransactionInput }>,
  reply: FastifyReply
): Promise<void> {
  const result = await createTransaction(request.body)
  await reply.code(result.code).send(result.data ?? result.error)
}

async function getTransactionHandler (
  request: FastifyRequest<{ Params: { transactionId: number } }>,
  reply: FastifyReply
): Promise<void> {
  const { transactionId } = request.params
  const result = await getTransaction(transactionId)
  await reply.code(result.code).send(result.data ?? result.error)
}

export async function transactionRoutes (app: FastifyInstance): Promise<void> {
  for (const schema of [...transactionSchemas]) {
    app.addSchema(schema)
  }

  app.get('/:transactionId', {
    preHandler: [app.authentication],
    schema: {
      params: $ref('singleTransactionParam'),
      response: {
        200: $ref('getTransactionResponse'),
        '4xx': { type: 'string' },
        '5xx': { type: 'string' }
      }
    }
  }, getTransactionHandler)

  app.post('/', {
    preHandler: [app.authentication],
    schema: {
      body: $ref('createTransactionInput'),
      response: {
        201: $ref('createTransactionResponse'),
        '4xx': { type: 'string' },
        '5xx': { type: 'string' }
      }
    }
  }, createTransactionHandler)
}
