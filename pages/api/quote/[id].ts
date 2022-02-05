import type { NextApiRequest, NextApiResponse } from "next"
import getDb from "../../../knex/connection"
import runCorsMiddleware from "../../../helpers/cors"

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  await runCorsMiddleware(req, res, "GET")

  const quote = await getDb()("quotes")
    .select("quotes.text as text", "authors.name as authorName")
    .where("quotes.id", req.query?.id)
    .join("authors", "authors.id", "=", "quotes.author_id")
    .first()

  res.status(200).json(quote)
}

export default handler
