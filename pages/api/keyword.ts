import type { NextApiRequest, NextApiResponse } from "next"
import getDb from "../../knex/connection"
import runCorsMiddleware from "../../helpers/cors"

interface Request extends NextApiRequest {
  query: {
    id: string
    text: string
  }
}

const handler = async (req: Request, res: NextApiResponse) => {
  const httpMethod = req.method
  await runCorsMiddleware(req, res, httpMethod)

  switch (httpMethod) {
    case "GET": {
      const keywords: { keyword: string; text: string; authorName: string } =
        await getDb()("keywords")
        .select("keywords.id as id", "keywords.text as keyword", "quotes.text as text", "authors.name as authorName")
        .join("quotes", "quotes.id", "=", "keywords.quote_id")
        .join("authors", "authors.id", "=", "quotes.author_id")

      res.status(200).json(keywords)
    } break

    case "POST": {
      const { text, quoteText }: { text: string, quoteText: string } = req.body
      let { quoteId }: { quoteId: number } = req.body

      quoteId = quoteId || (
          await getDb()("quotes")
          .select("id")
          .where("text", quoteText)
          .first()
        )?.id

      await getDb()("keywords")
        .insert({ 
          text: text,
          quote_id: quoteId
        })

      res.status(200).send(null)
    } break

    case "DELETE": {
      const { id = "0", text = "" } = req.query

      await getDb()("keywords")
        .where("id", id)
        .orWhere("text", text)
        .del()

        res.status(200).send(null)
    } break
  }
}

export default handler
