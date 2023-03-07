import NextCors from 'nextjs-cors';
import { NextApiRequest, NextApiResponse } from "next";

export { checkAuthorization } from '../../../libs/gateways/aws/auth'
export { withSessionRoute } from '../../../libs/withSession'

export async function allowCors(req: NextApiRequest, res: NextApiResponse) {
  await NextCors(req, res, {
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    origin: '*',
    optionsSuccessStatus: 200,
  });
}

export const isProductionMode = process.env.APP_ENV === 'production';


