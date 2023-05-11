import Schema from '../schema';

const schema = new Schema(
  {
    interval: {
      type: String,
      enum: ['day', 'week', 'month', 'year'],
    },
    interval_count: {
      type: Number,
      min: 0,
    },
  },
);

export default  schema;
