import Stripe from 'stripe'

import { stripe } from "../../../libs/gateways/stripe";

export async function createCheckoutSession(origin: string) {
  const params: Stripe.Checkout.SessionCreateParams = {
    mode: 'subscription',
    line_items: [
      {
        price: "",
        quantity: 1,
      },
    ],
    success_url: `${origin}/result?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/plans`,
  }
  const checkoutSession: Stripe.Checkout.Session = await stripe.checkout.sessions.create(params)
}