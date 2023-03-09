import { NextApiRequest, NextApiResponse } from 'next';
import {
  NotFound,
  allowCors,
  respondWithException,
  withSessionRoute,
  checkAuthorization,
  parseFromPostRequest,
  createCheckoutSession,
  getSubscription,
} from './helpers';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  let result;

  try {
    await allowCors(req, res);
    await checkAuthorization(req);

    const { currentUser } = req.session;

    if (req.method === 'GET') {
      result = await getSubscription(currentUser);
    } else if (req.method === 'POST') {
      const { planType } = parseFromPostRequest(req);
      result = await createCheckoutSession(currentUser, planType);
    } else {
      throw new NotFound;
    }

    res.status(200).json(result);
  } catch (ex: any) {
    respondWithException(res, ex);
  }
}

export default withSessionRoute(handler);

