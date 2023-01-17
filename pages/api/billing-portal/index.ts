import type { NextApiRequest, NextApiResponse } from 'next'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.REACT_STRIPE_SECRET_KEY || 'sk_test_51Ksb3LCHh3XhfaZr2tgzaQKAQtuTF9vRtgdXBS7X2rAaPC6FNoLQ3hyPFVmlnRhsif0FDdbi5cdgEh7Y1Wt9Umo900w9YPUGo6', {
  // https://github.com/stripe/stripe-node#configuration
  apiVersion: '2022-08-01',
})

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
