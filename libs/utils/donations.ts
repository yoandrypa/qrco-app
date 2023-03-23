import { createAxiosInstance } from "@ebanux/ebanux-utils/request";

export async function createQrDonationPayLynk(data: any, shortLink: string) {
  const axios = createAxiosInstance(`${process.env.PAYLINK_BASE_URL}/api/v2.0`);
  const name = `${data.qrName} (QR-DONATION)`.toUpperCase();
  const { data: { result: { id: priceId } } } = await axios.post('prices', {
    unit_amount: data.donationUnitAmount,
    nickname: name,
    product: { name },
    currency: 'usd',
  });

  data.priceId = priceId;

  return data;
}