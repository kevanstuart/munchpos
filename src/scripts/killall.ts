import { config } from '../config/constants'
import { exec as execCb } from 'child_process'
import util from 'node:util'
import 'dotenv/config'

const exec = util.promisify(execCb)

/**
 * Stop the container and remove the docker volume.
 * WARNING: THIS WILL DELETE ALL THE DATA
 */

async function removeContainer (): Promise<void> {
  await exec(`docker rm -f ${config.container}`)
}

async function removeVolume (): Promise<void> {
  await exec(`docker volume remove ${config.volume}`)
}

function stopContainer (): void {
  removeContainer()
    .then(async () => await removeVolume())
    .catch((error: unknown) => console.error(error))
}

void stopContainer()
