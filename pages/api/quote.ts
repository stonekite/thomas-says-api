import type { NextApiRequest, NextApiResponse } from "next"
import getDb from "../../knex/connection"
import runCorsMiddleware from "../../helpers/cors"

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  await runCorsMiddleware(req, res, "POST")

  const author = await getDb()("authors")
    .select("id")
    .where("name", req.body?.authorName)
  
  let authorId = author?.[0]?.id

  if (!authorId) {
    authorId = await getDb()("authors")
      .insert({ name: req.body?.authorName })
  }

  await getDb()("quotes")
    .insert({ 
      text: req.body?.text,
      author_id: authorId
    })

  res.status(200).send(null)
}

export default handler
