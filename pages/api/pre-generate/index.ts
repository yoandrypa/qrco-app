import { NextApiRequest, NextApiResponse } from 'next'
import { getPreGenCodes, geneNewCodes } from "./helpers";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  let codes;

  try {
    if (req.method == 'POST') {
      const { size, count, owner } = req.body;
      codes = await geneNewCodes(size, count, owner);
    } else if (req.method == 'GET') {
      codes = await getPreGenCodes(<string>req.query.owner);
    } else {
      return res.status(404);
    }

    res.status(200).json(codes);
  } catch (e: any) {
    return res.status(500).json({ error: e.message });
  }
}