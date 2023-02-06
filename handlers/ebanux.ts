const EBANUX_API = process.env.REACT_NODE_ENV == 'production' ? 'https://ebanux.link' : 'https://dev.ebanux.link';
import { EbanuxDonationPriceData, EbanuxSimplePaymentLinkData } from '../components/qr/types/types';

//@ts-ignore
import { request, createAxiosInstance } from "@ebanux/ebanux-utils/request";


const axios = createAxiosInstance(EBANUX_API);

export const createEbanuxDonationPrice = async (userId: string, data: EbanuxDonationPriceData) => {
    const payload = {
        amount: data.unitAmountUSD,
        cognitoUserId: userId
    };
    const response = await axios.post(`${EBANUX_API}/api/v1/donation`, payload)
    return response?.data;
}

export async function updateEbanuxDonationPrice(userId: string, priceId: string, data: EbanuxDonationPriceData) {
    const payload = {
        amount: data.unitAmountUSD,
        cognitoUserId: userId,
        priceId: data.priceId,
        productId: data.productId
    };
    const response = await axios.post(`${EBANUX_API}/api/v1/donation`, payload)
    return response?.data;
}

export async function createPaymentLink(userId: string, productData: EbanuxSimplePaymentLinkData) {
    const payload = {
        amount: productData.amount,
        cognitoUserId: userId,
        productName: productData.productName,
        description: productData.productDescription,
        successUrl: productData.successUrl
    };
    const response = await axios.post(`${EBANUX_API}/api/v1/sendmemoney`, payload)
    return response?.data;

}
