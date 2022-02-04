import config from "./knexfile"
import knex from "knex"
import type { Knex } from "knex"

let cachedConnection: Knex

const getConnection = () => {
  if (!cachedConnection) {
    cachedConnection = knex(config)
  }

  return cachedConnection

}

export default getConnection
