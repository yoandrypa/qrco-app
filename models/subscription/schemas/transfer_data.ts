import Schema from '../../commons/schema';

const schema = new Schema(
  {
    amount_percent: {
      type: Number,
    },
    destination: {
      type: String,
    },
  },
);

export default schema;
