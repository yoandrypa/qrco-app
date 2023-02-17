import { findByCustomerId as findUserByCustomerId, update, get } from '../handlers/users';
import { getUuid } from '../helpers/qr/helpers';
import axios from 'axios'

import { stripe } from "../libs/gateways/stripe";

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



