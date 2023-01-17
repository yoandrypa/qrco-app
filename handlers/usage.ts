import Stripe from 'stripe'
import { findByCustomerId as findUserByCustomerId, update, get } from '../handlers/users';
import { getUuid } from '../helpers/qr/helpers';

const stripe = new Stripe(process.env.REACT_STRIPE_SECRET_KEY || 'sk_test_51Ksb3LCHh3XhfaZr2tgzaQKAQtuTF9vRtgdXBS7X2rAaPC6FNoLQ3hyPFVmlnRhsif0FDdbi5cdgEh7Y1Wt9Umo900w9YPUGo6', {
    // https://github.com/stripe/stripe-node#configuration
    apiVersion: '2022-08-01',
});

// Record usage for a metered subscription
export async function saveUsage(userId: string, numRequests: number) {
    try {
        return await update({ id: userId }, { planUsage: numRequests })
    } catch (e) {
        return e;
    }
}

export async function recordPlanUsage(usageQuantity: number, subscriptionId: string, customerId: string) {
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



