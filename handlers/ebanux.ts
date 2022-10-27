import axios from 'axios'
const SERVER_URL = process.env.REACT_NODE_ENV === 'develop' ? 'https://dev.ebanux.link' : 'https://ebanux.link'
import { EbanuxDonationPriceData } from '../components/qr/types/types';

const APIv1 = axios.create({
    baseURL: `${SERVER_URL}/api/v1`
});

//Temporarely use of APIv1 and APIv2 until is fully migrated
export const APIv2 = axios.create({
    baseURL: `${SERVER_URL}/api/v2.0`,

});

export const createEbanuxDonationPrice = async (userId: string, token: string, data: EbanuxDonationPriceData) => {
    const result = await APIv1.post('/donation', {
        amount: data.unitAmountUSD * 100,
        cognitoUserId: userId
    }, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    return result;
}

async function updateEbanuxDonationPrice(userId: string, token: string, priceId: string, data: EbanuxDonationPriceData) {
    //TODO
}
