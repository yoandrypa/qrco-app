/**
 * Put here the general methods relative to stripe.
 */

import Stripe from 'stripe'

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || 'undefined';

const stripe = new Stripe(STRIPE_SECRET_KEY, { apiVersion: '2022-08-01' });

const util = require('../../libs/utils');

const constructEvent = (rawBody, signature, origin = 'platform') => {
  const secret = process.env[`STRIPE_EVENTS_${origin.toUpperCase()}_SECRET`] || 'undefined';

  return stripe.webhooks.constructEvent(rawBody, signature, secret);
};

const normalizeOptions = (options) => (util.isEmpty(options) ? null : options);

const parseRequestOptions = (request) => {
  const { onboarding } = request.currentUser.account;
  return onboarding?.type === 'standard' ? { stripeAccount: onboarding.account_id } : null;
};

const setBaseCognitoUserId = async (recordOrId, cognitoUserId, options, resource) => {
  const record = util.isObject(recordOrId) ? recordOrId : await resource.retrieve(recordOrId, options);
  const { metadata = {} } = record;

  if (!metadata.cognito_user_id) {
    resource.update(record.id, { metadata: { ...metadata, cognito_user_id: cognitoUserId } }, options);
  }
};

module.exports = {
  stripe,
  constructEvent,
  normalizeOptions,
  parseRequestOptions,
  setBaseCognitoUserId,
};
