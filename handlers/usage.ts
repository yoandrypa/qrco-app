import Stripe from 'stripe'
import { findByCustomerId as findUserByCustomerId, update, get } from '../handlers/users';
import { getUuid } from '../helpers/qr/helpers';
import axios from 'axios'

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

export async function recordPlanUsage(usageQuantity: number, subscriptionId: string, userId: string, overwrite: boolean = false) {
    const response = await axios.post('/api/usage', {
        usage: usageQuantity,
        subscriptionId: subscriptionId,
        userId: userId,
        overwrite: overwrite
    })
    if (response.status != 200) {
        console.error('Error saving plan usage: ', response);
        return new Error(response.statusText);
    }
    return true;
}



