const EBANUX_API = process.env.REACT_EBANUX_API || 'https://dev.ebanux.link';
import { EbanuxDonationPriceData } from '../components/qr/types/types';
import { handleFetchResponse } from './helpers';

export const createEbanuxDonationPrice = async (userId: string, token: string, data: EbanuxDonationPriceData) => {
    const payload = {
        amount: data.unitAmountUSD,
        cognitoUserId: userId
    };
    const options = {
        method: 'post',
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(payload)
    };
    const response = await fetch(`${EBANUX_API}/donation`, options);
    return await handleFetchResponse(response);
}

async function updateEbanuxDonationPrice(userId: string, token: string, priceId: string, data: EbanuxDonationPriceData) {
    const payload = {
        amount: data.unitAmountUSD,
        cognitoUserId: userId,
        priceId: data.priceId,
        productId: data.productId
    };
    const options = {
        method: 'patch',
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(payload)
    };
    const response = await fetch(`${EBANUX_API}/donation`, options);
    return await handleFetchResponse(response);
}
