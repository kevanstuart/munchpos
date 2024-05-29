import { buildJsonSchemas } from 'fastify-zod'
import zodDecimal from '../../utils/zodDecimal'
import { z } from 'zod'

const transactionProduct = z.object({
  productId: z.number(),
  quantity: z.number(),
  upsell: z.number().array().optional()
})

export const createTransactionInput = z.object({
  totalPrice: z.number().refine(
    zodDecimal, { message: 'Max scale is 2 decimal places' }
  ),
  totalQuantity: z.number().min(1),
  products: transactionProduct.array().nonempty()
})

export const createTransactionResponse = z.object({
  transactionId: z.number(),
  totalPrice: z.number(),
  totalQuantity: z.number()
})

export const singleTransactionParam = z.object({
  transactionId: z.number()
})

export const transactionProductResponse = z.object({
  transactionProductId: z.number(),
  transactionId: z.number(),
  productId: z.number(),
  price: z.number(),
  quantity: z.number(),
  createdAt: z.date(),
  updatedAt: z.date()
})

export const getTransactionResponse = z.object({
  transactionId: z.number(),
  totalPrice: z.number(),
  totalQuantity: z.number(),
  createdAt: z.date(),
  updatedAt: z.date(),
  products: transactionProductResponse.array().optional()
})

export type TransactionProductInput = z.infer<typeof transactionProduct>
export type CreateTransactionInput = z.infer<typeof createTransactionInput>
export type CreateTransactionResponse = z.infer<typeof createTransactionResponse>
export type SingleTransactionParam = z.infer<typeof singleTransactionParam>
export type GetTransactionResponse = z.infer<typeof getTransactionResponse>

export const { schemas: transactionSchemas, $ref } = buildJsonSchemas({
  createTransactionInput,
  createTransactionResponse,
  singleTransactionParam,
  getTransactionResponse
})
