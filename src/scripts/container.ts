import { config } from '../config/constants'
import { exec as execCb } from 'child_process'
import util from 'node:util'
import 'dotenv/config'

const exec = util.promisify(execCb)
const command = `docker run --name ${config.container} \
-e MYSQL_ROOT_PASSWORD=${config.root_password} \
-v ${config.volume}:/var/lib/mysql \
-p ${config.db_port}:${config.db_port} \
-d mysql`

function runContainer (): void {
  exec(command).catch((error: unknown) => console.error(error))
}

void runContainer()
