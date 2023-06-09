import type { NextApiRequest, NextApiResponse } from 'next'
import { saveUsage } from '../../../handlers/usage'
import { getUuid } from '../../../helpers/qr/helpers';
import { stripe } from "../../../libs/gateways/stripe";

async function recordUsage(usageQuantity: number, subscriptionId: string, overwrite: boolean = false) {
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
                //overwrite or increment usage
                action: overwrite ? 'set' : 'increment',
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

/**
 * 
 * @param req subscriptionId, userId, usage: number,(Optional) overwrite: false
 * @param res `
 * {
 * success: true
 * }
 * `
 * @returns 
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method != 'POST') return res.status(405).send('Method not allowed');
    if (req.body.subscriptionId) {
        try {
            //update in stripe
            await recordUsage(1, req.body.subscriptionId);
            //save in db
            await saveUsage(req.body.userId, req.body.usage);
            res.status(200).json({ success: true, message: 'Subscription usage was successfully setted' });
        } catch (error) {
            res.status(500).json(error)
        }
    }
}