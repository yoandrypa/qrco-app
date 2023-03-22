import { createAxiosInstance } from "@ebanux/ebanux-utils/request";

export async function createQrDonationPayLynk(data: any, shortLink: string) {
  const axios = createAxiosInstance(`${process.env.PAYLINK_BASE_URL}/api/v2.0`);
  const name = `QR-DONATION-${data.qrName}`.toUpperCase();
  const { data: { result: { id: priceId } } } = await axios.post('prices', {
    unit_amount: data.donationUnitAmount,
    nickname: name,
    product: { name },
    currency: 'usd',
  });

  const { data: { result: { id, url } } } = await axios.post('/payment/links', {
    line_items: [{
      price: priceId,
      quantity: 1,
      adjustable_quantity: {
        enabled: true,
        minimum: 1,
        maximum: 99,
      }
    }],
    submit_type: 'donate',
    after_completion: { type: 'redirect', redirect: { url: `${shortLink}?thanks=true` } },
  });

  data.payLynk = { id, url }

  return data;
}