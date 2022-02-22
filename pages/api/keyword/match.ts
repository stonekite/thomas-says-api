import type { NextApiRequest, NextApiResponse } from "next"
import getDb from "../../../knex/connection"
import runCorsMiddleware from "../../../helpers/cors"

interface Request extends NextApiRequest {
  body: {
    message: string
  }
}

const handler = async (req: Request, res: NextApiResponse) => {
  await runCorsMiddleware(req, res, "POST")

  const message = req.body.message.toLowerCase()

  const keywords: { keyword: string; text: string; authorName: string }[] =
    await getDb()("keywords")
    .select("keywords.text as keyword", "quotes.text as text", "authors.name as authorName")
    .join("quotes", "quotes.id", "=", "keywords.quote_id")
    .join("authors", "authors.id", "=", "quotes.author_id")

  const matchingKeywords = keywords.filter(({ keyword }) => message.match(keyword))

  const { keyword, ...quote } = matchingKeywords[Math.floor(Math.random() * matchingKeywords.length)]

  res.status(200).json(quote)
}

export default handler
