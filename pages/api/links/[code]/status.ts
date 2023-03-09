import { NextApiRequest, NextApiResponse } from 'next';
import {
  NotFound,
  respondWithException,
  checkLinkStatus,
  allowCors,
} from '../helpers';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  let result;

  try {
    await allowCors(req, res);

    if (req.method === "GET") {
      result = await checkLinkStatus(req.query.code as string);
    } else {
      throw new NotFound;
    }

    res.status(200).json({ type: 'qr_link', result });
  } catch (ex: any) {
    respondWithException(res, ex);
  }
}

export default handler;
