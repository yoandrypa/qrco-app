import { NextApiRequest, NextApiResponse } from 'next'
import { getPreGenCodes, geneNewCodes, parseFromPostRequest } from "./helpers";
import { respondWithException } from "../../../libs/exceptions";


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  let codes;

  try {
    if (req.method == 'POST') {
      const { size, count, owner } = parseFromPostRequest(req);
      codes = await geneNewCodes(size, count, owner);
    } else if (req.method == 'GET') {
      codes = await getPreGenCodes(<string>req.query.owner);
    } else {
      return res.status(404);
    }

    res.status(200).json(codes);
  } catch (ex: any) {
    respondWithException(res, ex);
  }
}