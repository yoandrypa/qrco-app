import Schema from '../commons/schema';

import IdentifierSchema from '../commons/identifier';

const schema = new Schema(
  {
    billing_cycle_anchor: {
      type: Number,
    },
    expires_at: {
      type: Number,
    },
    subscription_items: {
      type: [IdentifierSchema],
      default: [],
    },
    trial_end: {
      type: Number,
    },
    trial_from_plan: {
      type: Boolean,
    },
  },
);

export default schema;
