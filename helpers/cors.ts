import Cors from "cors"
import type { NextApiRequest, NextApiResponse } from "next"


const runCorsMiddleware = async (req: NextApiRequest, res: NextApiResponse, ...methods: string[]) => {
  const cors = Cors(methods)

  return new Promise((resolve, reject) => {
    cors(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result)
      }

      return resolve(result)
    })
  })
}

export default runCorsMiddleware