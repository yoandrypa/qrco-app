import { NextApiRequest, NextApiResponse } from 'next'
import { respondWithException, NotFound } from "../../../libs/exceptions";
import { createCheckoutSession } from './helpers'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  let result;

  try {
    if (req.method === 'POST') {
      result = await createCheckoutSession(req.headers.origin as string);
    } else {
      throw new NotFound;
    }

    res.status(200).json(result);
  } catch (ex: any) {
    respondWithException(res, ex);
  }
}