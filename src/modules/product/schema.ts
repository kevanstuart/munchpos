import zodDecimal from '../../utils/zodDecimal'
import { buildJsonSchemas } from 'fastify-zod'
import { z } from 'zod'

export const createProductInput = z.object({
  name: z.string().min(3).max(255),
  description: z.string().optional(),
  price: z.number().refine(
    zodDecimal, { message: 'Max scale is 2 decimal places' }
  ),
  quantity: z.number()
})

export const updateProductInput = z.object({
  productId: z.number(),
  name: z.string().min(3).max(255),
  description: z.string().optional(),
  price: z.number().refine(
    zodDecimal, { message: 'Max scale is 2 decimal places' }
  ),
  quantity: z.number()
})

export const upsertProductResponse = z.object({
  productId: z.number(),
  name: z.string()
})

export const singleProductParam = z.object({
  productId: z.number()
})

export const listProductResponse = z.object({
  productId: z.number(),
  name: z.string(),
  description: z.string().optional(),
  price: z.number(),
  quantity: z.number(),
  createdAt: z.date(),
  updatedAt: z.date()
}).array()

export type CreateProductInput = z.infer<typeof createProductInput>
export type UpdateProductInput = z.infer<typeof updateProductInput>
export type UpsertProductResponse = z.infer<typeof upsertProductResponse>
export type ListProductResponse = z.infer<typeof listProductResponse>
export type SingleProductParam = z.infer<typeof singleProductParam>

export const { schemas: productSchemas, $ref } = buildJsonSchemas({
  createProductInput,
  updateProductInput,
  upsertProductResponse,
  listProductResponse,
  singleProductParam
})
