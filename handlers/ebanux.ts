import axios from 'axios'
import { CustomError } from "../utils";
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

/**
 * 
 * @param userId Cognito User Id
 * @param unitAmountUSD 
 * @param quantity 
 */
export const createEbanuxDonationCoffiePrice = async (
    userId: string,
    unitAmountUSD: number,
) => {
    console.log('executing handler', userId, unitAmountUSD)
    //handle errors        
    try {
        const response = await APIv1.post('/donation',
            {//data
                cognitoUserId: userId,
                amount: unitAmountUSD
            })

    } catch (error) {
        throw new CustomError("Error uploading files", 500, error);
    }
}

export const updateCoffieDonationPrice = async () => {


}