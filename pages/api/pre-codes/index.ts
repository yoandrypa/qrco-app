import { NextApiRequest, NextApiResponse } from 'next'
import {
  getPreGenCodes,
  genNewCodes,
  loadNewCodes,
  parseFromPostRequest,
  parseFromPutsRequest,
  respondWithException,
} from "./helpers";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  let result;

  try {
    if (req.method == 'POST') {
      const { size, count, owner } = parseFromPostRequest(req);
      result = await genNewCodes(size, count, owner);
    } else if (req.method == 'PUT') {
      const { codes } = parseFromPutsRequest(req);
      result = await loadNewCodes(codes);
    } else if (req.method == 'GET') {
      result = await getPreGenCodes(<string>req.query.owner);
    } else {
      return res.status(404);
    }

    res.status(200).json(result);
  } catch (ex: any) {
    respondWithException(res, ex);
  }
}