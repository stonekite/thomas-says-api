import config from "./knexfile"
import knex from "knex"
import type { Knex } from "knex"

let cachedConnection: Knex

const getConnection = (): Knex => {
  if (!cachedConnection) {
    cachedConnection = knex(config)
  }

  return cachedConnection

}

export default getConnection
