import type { NextApiRequest, NextApiResponse } from 'next'
import { saveUsage } from '../../../handlers/usage'
import Stripe from 'stripe'
import { getUuid } from '../../../helpers/qr/helpers';

const stripe = new Stripe(process.env.REACT_STRIPE_SECRET_KEY || 'sk_test_51Ksb3LCHh3XhfaZr2tgzaQKAQtuTF9vRtgdXBS7X2rAaPC6FNoLQ3hyPFVmlnRhsif0FDdbi5cdgEh7Y1Wt9Umo900w9YPUGo6', {
    // https://github.com/stripe/stripe-node#configuration
    apiVersion: '2022-08-01',
});

async function recordUsage(usageQuantity: number, subscriptionId: string) {
    const subscriptionItems = await stripe.subscriptionItems.list({
        subscription: subscriptionId,
    });
    const subscriptionItemID = subscriptionItems.data[0].id;

    // The idempotency key allows you to retry this usage record call if it fails.
    const idempotencyKey = getUuid();
    const timestamp = (Date.now() / 1000);

    try {
        await stripe.subscriptionItems.createUsageRecord(
            subscriptionItemID,
            {
                quantity: usageQuantity,
                timestamp: timestamp,
                action: 'set',
            },
            {
                idempotencyKey,
            }
        );
    } catch (error) {
        if (error instanceof Error) {
            console.error(`Usage report failed for item ID ${subscriptionItemID} with
            idempotency key ${idempotencyKey}: ${error.toString()}`);
        }
    }

}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method != 'POST') return res.status(405).send('Method not allowed');
    if (req.body.subscriptionId) {
        try {
            //update in stripe
            await recordUsage(1, req.body.subscriptionId);
            //save in db
            await saveUsage(req.body.customerId, req.body.subscriptionId, 1);
            res.status(200).json({ success: true, message: 'Subscription usage was successfully setted' });
        } catch (error) {
            res.status(500).json(error)
        }
    }
}