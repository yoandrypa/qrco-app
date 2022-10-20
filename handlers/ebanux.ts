import axios from 'axios'

import { Auth } from 'aws-amplify';

const SERVER_URL = process.env.DEVELOPMENT_MODE ? 'https://ebanux.com' : 'https://dev.ebanux.link'
const cognitoSession = await Auth.currentSession();

const APIv1 = axios.create({
    baseURL: `${SERVER_URL}/api/v1`,
    headers: {
        'Authorization': `Basic ${cognitoSession.getAccessToken().getJwtToken()}`
    }
});


//Temporarely use of APIv1 and APIv2 until is fully migrated
export const APIv2 = axios.create({
    baseURL: `${SERVER_URL}/api/v2.0`,
    headers: {
        'Authorization': `Basic ${cognitoSession.getAccessToken().getJwtToken()}`
    }
});

export const createEbanuxDonationPrice = () => {


}
