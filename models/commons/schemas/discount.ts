import Schema from '../schema';

import IdentifierSchema from './identifier';

const schema = new Schema({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  coupon: {
    type: Object,
    schema: IdentifierSchema,
  },
  promotion_code: {
    type: Object,
    schema: IdentifierSchema,
  },
  customer: {
    type: String,
  },
  end: {
    type: Number,
  },
  start: {
    type: Number,
  },
  subscription: {
    type: String,
  },
  checkout_session: {
    type: String,
  },
  invoice: {
    type: String,
  },
  invoice_item: {
    type: String,
  },
});

export default schema;
