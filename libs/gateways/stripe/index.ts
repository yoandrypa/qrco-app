/**
 * Put here the general methods relative to stripe.
 */

import Stripe from 'stripe';
//@ts-ignore
import { isEmpty } from 'underscore';

const apiKey = process.env.STRIPE_SECRET_KEY || 'undefined';

export const stripe = new Stripe(apiKey, { apiVersion: '2022-11-15' });

export const constructEvent = (payload: string, signature: string) => {
  const secret = process.env[`STRIPE_EVENTS_SECRET`] || 'undefined';

  return stripe.webhooks.constructEvent(payload, signature, secret);
};

export const normalizeOptions = (options: Stripe.RequestOptions | undefined): Stripe.RequestOptions | undefined => (
  isEmpty(options) ? undefined : options
);
