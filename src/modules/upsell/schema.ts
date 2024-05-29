import { buildJsonSchemas } from 'fastify-zod'
import { z } from 'zod'

export const createUpsellInput = z.object({
  productId: z.number(),
  upsellIds: z.number().array()
})

export const getUpsellParams = z.object({
  productId: z.number()
})

export const getUpsellResponse = z.object({
  productId: z.number(),
  name: z.string(),
  description: z.string().optional(),
  price: z.number(),
  quantity: z.number(),
  createdAt: z.date(),
  updatedAt: z.date()
}).array()

export const removeUpsellParams = z.object({
  productId: z.number(),
  upsellId: z.number()
})

export type CreateUpsellInput = z.infer<typeof createUpsellInput>
export type GetUpsellParams = z.infer<typeof getUpsellParams>
export type GetUpsellResponse = z.infer<typeof getUpsellResponse>
export type RemoveUpsellParams = z.infer<typeof removeUpsellParams>

export const { schemas: upsellSchemas, $ref } = buildJsonSchemas({
  createUpsellInput,
  getUpsellParams,
  getUpsellResponse,
  removeUpsellParams
})
