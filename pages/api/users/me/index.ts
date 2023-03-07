import { NextApiRequest, NextApiResponse } from 'next'
import {
  allowCors,
  checkAuthorization,
  respondWithException,
  withSessionRoute,
} from "../helpers";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  let result;

  try {
    await allowCors(req, res);
    await checkAuthorization(req);

    const { currentUser } = req.session;

    if (req.method == 'GET') {
      result = { type: 'user', result: currentUser };
    } else {
      return res.status(404);
    }

    res.status(200).json(result);
  } catch (ex: any) {
    respondWithException(res, ex);
  }
}

export default withSessionRoute(handler);
