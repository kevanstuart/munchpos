import 'dotenv/config'

/**
 * The following configuration exists in a dotenv
 * file to be created in the root of the project.
 * Keys are to start with "MUNCH_":
 * E.g. MUNCH_DB_NAME=<your_database_name>
 */
const envKeyStart = 'MUNCH_'
const typeKeys = [
  'db_name',
  'root_user',
  'root_password',
  'rw_user',
  'rw_password',
  'jwt_secret'
] as const

type Key = typeof typeKeys[number]
type EnvVars = Map<Key, string>

const reducer = (
  map: EnvVars, item: [string, string | undefined]
): any => {
  const key = item[0].replace(envKeyStart, '').toLocaleLowerCase() as Key
  if (typeKeys.includes(key) && item[1] !== undefined) {
    map.set(key, item[1])
  }
  return map
}

const envVariables = Object
  .entries(process.env)
  .reduce<EnvVars>(reducer, new Map<Key, string>())

// Merge the dotenv variables with some constant variables
export const config = Object.assign({
  api_port: 3002,
  db_port: 3306,
  db_host: 'localhost',
  container: 'munch-more-sql',
  volume: 'munch-more-sql-data',
  salt_rounds: 10,
  cookie_max_age: 28800
}, Object.fromEntries(envVariables))
