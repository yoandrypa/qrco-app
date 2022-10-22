import axios from 'axios'

import { Auth } from 'aws-amplify';

const SERVER_URL = process.env.DEVELOPMENT_MODE ? 'https://dev.ebanux.link' : 'https://ebanux.link'
// const cognitoSession = await Auth.currentSession();

const APIv1 = axios.create({
    baseURL: `${SERVER_URL}/api/v1`
});


//Temporarely use of APIv1 and APIv2 until is fully migrated
export const APIv2 = axios.create({
    baseURL: `${SERVER_URL}/api/v2.0`,

});

export const createEbanuxDonationPrice = async (userId: string, token: string, unitAmountUSD: number) => {
    const result = await APIv1.post('/donation', {
        amount: unitAmountUSD,
        cognitoUserId: userId
    }, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    return result;
}
