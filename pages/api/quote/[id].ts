import type { NextApiRequest, NextApiResponse } from "next"
import getDb from "../../../knex/connection"

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const quote = await getDb()("quotes")
    .select("quotes.text as text", "authors.name as authorName")
    .where("quotes.id", req.query?.id)
    .join("authors", "authors.id", "=", "quotes.author_id")

  res.status(200).json(quote?.[0])
}

export default handler
