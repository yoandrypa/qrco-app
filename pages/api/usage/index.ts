import type { NextApiRequest, NextApiResponse } from 'next'
import { recordUsage, reportUsage, getSubscriptionFromCustomer } from '../../../handlers/usage'




export default function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method != 'POST') return res.status(405).send('Method not allowed')

    res.status(200).json({ name: 'Subscription usage was successfully setted' })
}