import Schema from '../commons/schema';

const schema = new Schema(
  {
    amount_gte: {
      type: Number,
    },
    reset_billing_cycle_anchor: {
      type: Boolean,
    },
  },
);

export default schema;
