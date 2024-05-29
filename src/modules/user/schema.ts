import { buildJsonSchemas } from 'fastify-zod'
import { z } from 'zod'

export const userInput = z.object({
  email: z.string().email(),
  password: z.string().min(6)
})

export const registerResponse = z.object({
  userId: z.number(),
  email: z.string().email()
})

export const loginResponse = z.object({
  accessToken: z.string()
})

export const listResponse = z.array(z.object({
  userId: z.number(),
  email: z.string().email(),
  createdAt: z.date(),
  updatedAt: z.date()
}))

export type UserInput = z.infer<typeof userInput>
export type RegisterUserResponse = z.infer<typeof registerResponse>
export type LoginUserResponse = z.infer<typeof loginResponse>
export type ListUserResponse = z.infer<typeof listResponse>

export const { schemas: userSchemas, $ref } = buildJsonSchemas({
  userInput,
  registerResponse,
  loginResponse,
  listResponse
})
