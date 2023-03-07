import { NextApiRequest, NextApiResponse } from 'next';
import {
  NotFound,
  respondWithException,
  withSessionRoute,
  checkAuthorization,
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
      result = await countLinks(currentUser);
    } else {
      throw new NotFound;
    }

    res.status(200).json({ type: 'qr_link', result });
  } catch (ex: any) {
    respondWithException(res, ex);
  }
}

export default withSessionRoute(handler);
