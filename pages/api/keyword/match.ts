import type { NextApiRequest, NextApiResponse } from "next"
import getDb from "../../../knex/connection"
import runCorsMiddleware from "../../../helpers/cors"

interface Request extends NextApiRequest {
  query: {
    message: string
  }
}

const handler = async (req: Request, res: NextApiResponse) => {
  await runCorsMiddleware(req, res, "GET")

  const { message = "" } = req.query

  const words: string[] = 
    message
    .toLowerCase()
    .replace(/\s+/g, " ")
    .replace(/[^\w\s]+/g, "")
    .split(" ")

  const quotes: { text: string; authorName: string }[] = 
    await getDb()("keywords")
    .select("quotes.text as text", "authors.name as authorName")
    .join("quotes", "quotes.id", "=", "keywords.quote_id")
    .join("authors", "authors.id", "=", "quotes.author_id")
    .whereIn("keywords.text", words)
    .first()

  const quote = quotes[Math.floor(Math.random() * quotes.length)]

  res.status(200).json(quote)
}

export default handler
