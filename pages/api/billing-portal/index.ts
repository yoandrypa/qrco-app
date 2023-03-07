import type { NextApiRequest, NextApiResponse } from 'next';

import {
  NotFound,
  respondWithException,
  withSessionRoute,
  checkAuthorization,
  getBillingPortal,
  allowCors,
} from './helpers';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  let result;

  try {
    await allowCors(req, res);
    await checkAuthorization(req);

    const { currentUser } = req.session;

    if (req.method === 'GET') {
      result = await getBillingPortal(currentUser);
    } else {
      throw new NotFound;
    }

    res.status(200).json(result);
  } catch (ex: any) {
    respondWithException(res, ex);
  }
}

export default withSessionRoute(handler);