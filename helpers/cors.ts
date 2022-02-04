import Cors from "cors"

const runCorsMiddleware = async (req, res, ...methods) => {
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