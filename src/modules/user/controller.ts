import { JWT } from '@fastify/jwt'

import { compareHash, hashString } from '../../utils/hashFunctions'
import { Response } from '../../utils/types'
import User from './model'
import {
  ListUserResponse,
  LoginUserResponse,
  RegisterUserResponse,
  UserInput,
  userInput
} from './schema'

async function userExists (email: string): Promise<boolean> {
  const user = await User.findOne({ where: { email } })
  return user !== null
}

export async function registerUser (
  request: UserInput
): Promise<Response<RegisterUserResponse>> {
  const validation = userInput.safeParse(request)
  if (!validation.success) {
    console.error(validation.error)
    return { code: 400, error: 'This data does not match required parameters' }
  }

  const exists = await userExists(validation.data.email)
  if (exists) return { code: 409, error: 'This user already exists' }

  try {
    validation.data.password = await hashString(validation.data.password)
    const instance = await User.create(validation.data)
    return {
      code: 201,
      data: {
        userId: instance.userId,
        email: instance.email
      }
    }
  } catch (error: unknown) {
    console.error(error)
    return { code: 500, error: 'Server Error. Please contact the administrator.' }
  }
}

export async function loginUser (
  request: UserInput,
  jwt: JWT
): Promise<Response<LoginUserResponse>> {
  const validation = userInput.safeParse(request)
  if (!validation.success) {
    console.error(validation.error)
    return { code: 400, error: 'This data does not match required parameters' }
  }

  try {
    const user = await User.findOne({ where: { email: validation.data.email } })
    if (user === null) return { code: 401, error: 'Invalid username or password' }

    const matched = await compareHash(validation.data.password, user.password)
    if (!matched) return { code: 401, error: 'Invalid username or password' }

    const token = jwt.sign({
      userId: user.userId,
      email: user.email
    })

    return { code: 200, data: { accessToken: token } }
  } catch (error: unknown) {
    console.error(error)
    return { code: 500, error: 'Server Error. Please contact the administrator.' }
  }
}

export async function listUsers (): Promise<Response<ListUserResponse>> {
  try {
    const users = await User.findAll({
      attributes: {
        exclude: ['password']
      }
    })

    return { code: 200, data: users }
  } catch (error: unknown) {
    console.error(error)
    return { code: 500, error: 'Server Error. Please contact the administrator.' }
  }
}
