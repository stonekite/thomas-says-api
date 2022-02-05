import type { NextApiRequest, NextApiResponse } from "next"
import getDb from "../../knex/connection"
import runCorsMiddleware from "../../helpers/cors"

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const httpMethod = req.method
  await runCorsMiddleware(req, res, httpMethod)

  switch (httpMethod) {
    case "GET": {
      const quoteIds = await getDb()("quotes")
        .select("id")
        .from("quotes")

      const quoteId = quoteIds[Math.floor(Math.random() * quoteIds.length)]?.id

      const quote = await getDb()("quotes")
        .select("quotes.text as text", "authors.name as authorName")
        .where("quotes.id", quoteId)
        .join("authors", "authors.id", "=", "quotes.author_id")
        .first()

      res.status(200).json(quote)
    } break

    case "POST": {
      const { text, authorName } = req.body

      const author = await getDb()("authors")
        .select("id")
        .where("name", authorName)
        .first()

      let authorId = author?.id

      if (!authorId) {
        authorId = await getDb()("authors")
          .insert({ name: authorName })
      }

      await getDb()("quotes")
        .insert({ 
          text: text,
          author_id: authorId
        })

      res.status(200).send(null)
    } break

    case "DELETE": {
      const { id = 0, text = "" } = req.query

      await getDb()("quotes")
        .where("id", id)
        .orWhere("text", text)
        .del()

        res.status(200).send(null)
    } break
  }
}

export default handler
