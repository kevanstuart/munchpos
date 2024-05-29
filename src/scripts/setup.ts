import mysql, { Connection } from 'mysql2/promise'
import { config } from '../config/constants'
import 'dotenv/config'

async function getConnection (): Promise<Connection> {
  return await mysql.createConnection({
    host: config.db_host,
    user: config.root_user,
    password: config.root_password,
    port: Number(config.db_port)
  })
}

// Prepared statements don't support object names
async function createDatabase (db: Connection): Promise<void> {
  await db.execute(`CREATE DATABASE IF NOT EXISTS ${config.db_name}`)
}

// Prepared statements don't support object names
async function createRwUser (db: Connection): Promise<void> {
  await db.execute(`
    CREATE USER '${config.rw_user}'@'%'
      IDENTIFIED BY '${config.rw_password}';
  `)

  await db.execute(`
    GRANT ALL PRIVILEGES ON ${config.db_name}.* 
      TO '${config.rw_user}'@'%';
  `)

  await db.execute('FLUSH PRIVILEGES;')
}

export function setupDatabase (): void {
  getConnection()
    .then(async (connection) => {
      if (connection !== undefined) {
        await createDatabase(connection)
        await createRwUser(connection)
        await connection.end()
      }
    })
    .catch((err: unknown) => console.error(err))
}

void setupDatabase()
