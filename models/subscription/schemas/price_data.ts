import Schema from '../../commons/schema';

import CurrencySchema from '../../commons/schemas/currency';
import RecurringSchema from '../../commons/schemas/interval';

const schema = new Schema(
  {
    currency: CurrencySchema,
    product: {
      type: String,
    },
    recurring: {
      type: RecurringSchema,
    },
    unit_amount_decimal: {
      type: Number,
      min: 0,
    },
    tax_behavior: {
      type: String,
      enum: ['inclusive', 'exclusive', 'unspecified'],
      default: 'unspecified',
    },
    unit_amount: {
      type: Number,
      min: 0,
    },
  },
);

export default schema;
