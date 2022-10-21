import axios from 'axios'
import { CustomError } from "../utils";
import { Auth, Amplify } from 'aws-amplify';
import awsExports from "../libs/aws/aws-exports";


const SERVER_URL = process.env.DEVELOPMENT_MODE ? 'https://ebanux.com' : 'https://dev.ebanux.link'
Amplify.configure(awsExports);
const cognitoSession = await Auth.currentSession();
const cognitoToken = cognitoSession.getAccessToken().getJwtToken(


)
const APIv1 = axios.create({
    baseURL: `${SERVER_URL}/api/v1`
});


//Temporarely use of APIv1 and APIv2 until is fully migrated
export const APIv2 = axios.create({
    baseURL: `${SERVER_URL}/api/v2.0`
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
    jwtToken: string
) => {
    console.log('executing handler', userId, unitAmountUSD)
    //handle errors   

    const response = await APIv1.post('/donation',
        {//data
            cognitoUserId: userId,
            amount: unitAmountUSD
        }, {
        headers: {
            'Authorization': `Bearer ${cognitoToken}`
        }
    })
    return response;


}

export const updateCoffieDonationPrice = async () => {


}