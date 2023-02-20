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
      const { codes, owner } = parseFromPutsRequest(req);
      result = await loadNewCodes(codes, owner);
    } else if (req.method == 'GET') {
      result = await getPreGenCodes(req.query.owner as string);
    } else {
      return res.status(404);
    }

    res.status(200).json(result);
  } catch (ex: any) {
    respondWithException(res, ex);
  }
}