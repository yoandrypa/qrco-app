import { NextApiRequest, NextApiResponse } from 'next';
import {
  NotFound,
  respondWithException,
  withSessionRoute,
  checkAuthorization,
  parseFromCountRequest,
  countLinks,
  allowCors,
} from './helpers';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  let result;

  try {
    await allowCors(req, res);
    await checkAuthorization(req);

    const { currentUser } = req.session;

    if (req.method === "GET") {
      const { preGenerated } = parseFromCountRequest(req);
      result = await countLinks(currentUser, preGenerated);
    } else {
      throw new NotFound;
    }

    res.status(200).json({ type: 'qr_link', result });
  } catch (ex: any) {
    respondWithException(res, ex);
  }
}

export default withSessionRoute(handler);
