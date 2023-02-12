import Schema from '../commons/schema';

const schema = new Schema(
  {
    payment_method_options: {
      type: Schema.Types.Mixed,
    },
    payment_method_types: {
      type: String,
      // enum: [], TODO: Set enum values
    },
    save_default_payment_method: {
      type: String,
      enum: ['off', 'on_subscription'],
    },
  },
);

export default schema;
