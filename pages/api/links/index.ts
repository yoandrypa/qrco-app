import { NextApiRequest, NextApiResponse } from 'next';
import {
  NotFound,
  allowCors,
  respondWithException,
  withSessionRoute,
  checkAuthorization,
  parseFromPostRequest,
  parseFromListRequest,
  fetchLinks,
  createLink,
} from './helpers';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  let result;

  try {
    await allowCors(req, res);
    await checkAuthorization(req);

    const { currentUser } = req.session;

    if (req.method === "GET") {
      const { limit, nextPageKey } = parseFromListRequest(req);
      result = await fetchLinks(currentUser, limit, nextPageKey);
    } else if (req.method === "POST") {
      const data = parseFromPostRequest(req);
      result = await createLink(data);
    } else {
      throw new NotFound;
    }

    res.status(200).json({ type: 'qr_link', result });
  } catch (ex: any) {
    respondWithException(res, ex);
  }
}

export default withSessionRoute(handler);
