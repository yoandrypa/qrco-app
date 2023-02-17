import type { NextApiRequest, NextApiResponse } from 'next'

import { stripe } from "../../../libs/gateways/stripe";

type Data = {
  url?: string,
  error?: string
}

export default async function BillingPortal(req: NextApiRequest, res: NextApiResponse<Data>) {
  if (req.method === 'POST') {

    const customer = req.body.customerId
    if (!customer) return res.status(400)
    try {

      const { url } =
        await stripe.billingPortal.sessions.create({
          customer: customer,
          return_url: `https://${process.env.REACT_APP_SERVER_BASE_URL}/plans/`,
        });
      res.redirect(301, url);
      // res.status(200).json({url: url})
    } catch (e) {
      console.error(e, `Stripe Billing Portal redirect error`);
      if (e instanceof Error)
        // Here, consider redirecting the user to an error page
        return res.status(500).json({ error: e.message });
    }
  }


}
