import { database } from './config/sequelize'
import { config } from './config/constants'
import syncModels from './utils/syncModels'
import { main } from '.'

const server = main({ logger: true })

async function runServer (): Promise<void> {
  try {
    await database.authenticate()
    await syncModels()
    await server.listen({
      port: config.api_port
    })
  } catch (err: unknown) {
    server.log.error(err)
    await database.close()
    process.exit(1)
  }
}

async function exitServer (): Promise<void> {
  await server.close()
  await database.close()
  process.exit(0)
}

['SIGINT', 'SIGTERM'].forEach((signal) => {
  process.on(signal, () => {
    exitServer()
      .then(() => server.log.error('Server closed unexpectedly.'))
      .catch(error => server.log.error(error))
  })
})

void runServer()
