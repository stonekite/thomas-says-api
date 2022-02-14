import type { NextApiRequest, NextApiResponse } from "next"
import getDb from "../../../knex/connection"
import runCorsMiddleware from "../../../helpers/cors"

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  await runCorsMiddleware(req, res, "GET")

  const quoteIds: { id: number }[] =
    await getDb()("quotes")
    .select("id")

  const quoteId = quoteIds[Math.floor(Math.random() * quoteIds.length)]?.id

  const quote: { text: string; authorName: string } = 
    await getDb()("quotes")
    .select("quotes.text as text", "authors.name as authorName")
    .where("quotes.id", quoteId)
    .join("authors", "authors.id", "=", "quotes.author_id")
    .first()

  res.status(200).json(quote)
}

export default handler
