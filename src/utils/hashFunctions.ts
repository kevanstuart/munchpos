import { config } from '../config/constants'
import { compare, genSalt, hash } from 'bcrypt'

/**
 * Will not be tested as these are just wrappers
 * around bcrypt that will allow us to easily swap
 * out hashing implementations in future versions.
 */

export async function hashString (
  data: string
): Promise<string> {
  const salt = await genSalt(config.salt_rounds)
  return await hash(data, salt)
}

export async function compareHash (
  plainPassword: string,
  hashPassword: string
): Promise<boolean> {
  return await compare(plainPassword, hashPassword)
}
