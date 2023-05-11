import Schema from '../../commons/schema';

import BillingThresholdsSchema from './billing_thresholds';
import IdentifierSchema from '../../commons/schemas/identifier';

const schema = new Schema(
  {
    id: {
      type: String,
    },
    price: {
      type: Object,
      schema: IdentifierSchema,
    },
    quantity: {
      type: Number,
      min: 0,
    },
    billing_thresholds: {
      type: Object,
      schema: BillingThresholdsSchema,
    },
    created: {
      type: Number,
    },
    tax_rates: {
      type: Array,
      schema: [IdentifierSchema],
      default: [],
    },
    metadata: {
      type: Object,
    },
  },
  {
    saveUnknown: [
      'metadata.**'
    ],
  },
);

export default schema;
