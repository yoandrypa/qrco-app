import Schema from '../commons/schema';

import BillingThresholdsSchema from './billing_thresholds';
import IdentifierSchema from '../commons/identifier';

const schema = new Schema(
  {
    id: {
      type: String,
    },
    price: {
      type: IdentifierSchema,
    },
    plan: {
      type: IdentifierSchema,
    },
    quantity: {
      type: Number,
      min: 0,
    },
    billing_thresholds: {
      type: BillingThresholdsSchema,
    },
    created: {
      type: Number,
    },
    tax_rates: {
      type: [IdentifierSchema],
      default: [],
    },
    metadata: {
      type: Object,
    },
  },
);

export default schema;
