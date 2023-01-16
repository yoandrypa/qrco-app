import type { NextApiRequest, NextApiResponse } from 'next'
import { recordUsage, reportUsage, getSubscriptionFromCustomer } from '../../../handlers/usage'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method != 'POST') return res.status(405).send('Method not allowed')

    if (req.body.subscriptionId) {
        try {
            await recordUsage(1, req.body.subscriptionId)
            res.status(200).json({ success: true, message: 'Subscription usage was successfully setted' });
        } catch (error) {
            res.status(500).json(error)
        }
    }
}