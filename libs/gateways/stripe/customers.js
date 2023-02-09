const { stripe, normalizeOptions, parseRequestOptions, setBaseCognitoUserId } = require('./base');

const create = (data, options = null) => stripe.customers.create(data, normalizeOptions(options));

const update = (id, data, options = null) => stripe.customers.update(id, data, normalizeOptions(options));

const remove = (id, options = null) => stripe.customers.del(id, normalizeOptions(options));

const setCognitoUserId = (recordOrId, cognitoUserId, options) => (
  setBaseCognitoUserId(recordOrId, cognitoUserId, normalizeOptions(options), stripe.customers)
);

export {
  parseRequestOptions,
  create,
  update,
  remove,
  setCognitoUserId,
};
