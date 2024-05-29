import { config } from './constants'
import {
  Options,
  Sequelize
} from 'sequelize'

const configuration: Options = {
  database: config.db_name,
  username: config.rw_user,
  password: config.rw_password,
  host: config.db_host,
  dialect: 'mysql'
}

export const database = new Sequelize(configuration)
