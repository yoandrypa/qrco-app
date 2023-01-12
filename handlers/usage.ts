import Stripe from 'stripe'
import Customer from 'stripe'
import { findByCustomerId as findUserByCustomerId } from '../handlers/users';
import { getUuid } from '../helpers/qr/helpers';
const stripe = new Stripe(process.env.REACT_STRIPE_SECRET_KEY || 'sk_test_51Ksb3LCHh3XhfaZr2tgzaQKAQtuTF9vRtgdXBS7X2rAaPC6FNoLQ3hyPFVmlnRhsif0FDdbi5cdgEh7Y1Wt9Umo900w9YPUGo6', {
    // https://github.com/stripe/stripe-node#configuration
    apiVersion: '2022-08-01',
});

// Record usage for a metered subscription
export async function reportUsage(customerId: string, subscriptionId: string, numRequests: number) {
    try {
        // Get the subscription for this customer
        const [user] = await findUserByCustomerId(customerId);
        const subscriptionId = user.subscriptionData.id;
        const totalUsage = await recordUsage(numRequests, user.id);
        return ({ numRequests: totalUsage });
    } catch (e) {
        if (e instanceof Error) return (new Error(e.message));
    }
}

export async function recordUsage(usageQuantity: number, subscriptionItemID: string) {
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




export async function getSubscriptionFromCustomer(customerId: string) {

}