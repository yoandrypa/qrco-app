import Schema from '../commons/schema';

const schema = new Schema(
  {
    behavior: {
      type: String,
    },
    resumes_at: {
      type: Number,
    },
  },
);

export default schema;
