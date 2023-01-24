import { NextApiRequest, NextApiResponse } from 'next'
import Stripe from 'stripe'
import { update, get, create } from '../../../handlers/users'
import { PLAN_TEST_MODE_PRICES, PLAN_LIVE_MODE_PRICES } from '../../../consts'
//init stripe
const stripe = new Stripe(process.env.REACT_STRIPE_SECRET_KEY || 'sk_test_51Ksb3LCHh3XhfaZr2tgzaQKAQtuTF9vRtgdXBS7X2rAaPC6FNoLQ3hyPFVmlnRhsif0FDdbi5cdgEh7Y1Wt9Umo900w9YPUGo6', {
  // https://github.com/stripe/stripe-node#configuration
  apiVersion: '2022-08-01',
})

type PriceLineItem = {
  price: string,
  quantity?: number
}

async function createCustomerInStripe(email: string): Promise<string | Error> {
  try {
    const params: Stripe.CustomerCreateParams = {
      email: email
    }
    const customer: Stripe.Customer = await stripe.customers.create(params)
    return customer.id
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Internal server error'
    console.log('Error creating customer in stripe', err)
    return err as Error
  }
}

function getCurrentPrices() {
  if (process.env.REACT_NODE_ENV != 'production') {
    return PLAN_TEST_MODE_PRICES
  } else {
    return PLAN_LIVE_MODE_PRICES
  }
}

async function createCheckoutSession(
  { customer_id, plan_type, email }: { customer_id: string; plan_type: PlanType, email: string }) {
  const pricesList = getCurrentPrices()
  let price_id;
  switch (plan_type) {
    case 'basic':
      price_id = pricesList.basic
      break;
    case 'basicAnnual':
      price_id = pricesList.basicAnnual
      break;
    case 'business':
      price_id = pricesList.business
      break;
    case 'businessAnnual':
      price_id = pricesList.businessAnnual
      break;
    case 'premium':
      price_id = pricesList.premium
      break;
    case 'premiumAnnual':
      price_id = pricesList.premiumAnnual
      break;
    default:
      price_id = "unknown"
      break;
  }
  try {
    let lineItem: PriceLineItem = { price: price_id }
    // For metered billing, do not pass quantity
    //Legacy Premium plans is flat priced
    // if (![pricesList.premium, pricesList.premiumAnnual].includes(price_id)) {

    //   lineItem = { ...lineItem, quantity: 1 }
    // }

    const session = stripe.checkout.sessions.create({
      mode: 'subscription',
      customer: customer_id,
      line_items: [
        lineItem
      ],

      success_url: `https://${process.env.REACT_APP_SERVER_BASE_URL}/plans/account?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `https://${process.env.REACT_APP_SERVER_BASE_URL}/plans/`
    })
    return session
  } catch (error) {
    console.log('Error creating customer in stripe', error)
    return error as Error
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {

  if (req.method === 'POST') {
    if (!req.body.id || !req.body.email || !req.body.plan_type) {
      return res.status(400).send('Missing parameters in request (email, plan_type and id)')
    }


    let userData = await get(req.body.id)
    if (!userData) {
      userData = await create({ id: req.body.id });
      console.log('created on the fly user', userData);
    }

    //creating new customer
    let customer_id: string | Error
    if (!userData.customerId) {
      console.log('creating new customer...')
      customer_id = await createCustomerInStripe(req.body.email);
      if (customer_id instanceof Error) {
        return res.status(500).json({ error: true, message: customer_id.message })
      }
      const updateResult = await update({ id: req.body.id }, { customerId: customer_id })
      if (!updateResult) {
        console.log('Error saving customer_id in database')
        return res.status(500).json(updateResult)
      }
    } else {
      customer_id = userData.customerId
    }

    if (customer_id instanceof Error) {
      return res.status(500).json({ error: true, message: customer_id.message })
    }
    //create checkout session
    try {
      const { id } = await get(req.body.id)
      const result = await update({ id: id }, { planType: req.body.plan_type })
      if (!result || result == 'undefined') {
        return res.status(500).json({ error: true, message: `Could not save user plan in id: ${id} plan : ${req.body.plan_type}` })
      }
      const session = await createCheckoutSession({ customer_id: customer_id, plan_type: req.body.plan_type, email: req.body.email })
      if (!(session instanceof Error)) return res.status(200).json({ result: { url: session.url, customer: customer_id } })
    } catch (error) {
      if (error instanceof Error) {
        return res.status(500).json({ error: true, message: error.message })
      }

    }

  } else {
    //Incorrect method
    res.setHeader('Allow', 'POST')
    res.status(405).end('Method Not Allowed')
  }



}