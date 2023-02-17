/**
 * Put here the general methods relative to stripe.
 */

import Stripe from 'stripe';

const apiKey = process.env.STRIPE_SECRET_KEY || 'undefined';
const secret = process.env.STRIPE_EVENTS_SECRET || 'undefined';

export const stripe = new Stripe(apiKey, { apiVersion: '2022-11-15' });

export const constructEvent = (payload: string | Buffer, signature: string) => {
  return stripe.webhooks.constructEvent(payload, signature, secret);
};
