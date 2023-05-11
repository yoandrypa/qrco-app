import dynamoose from "../../libs/gateways/dynamodb/dynamoose";

// Instantiate a dynamoose schema
const schema = new dynamoose.Schema({
  code: {
    type: String,
    hashKey: true,
    required: true,
  },
  owner: {
    type: String,
    index: true,
  },
}, {
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: undefined,
  },
});

// Create a model from schema and export it
export const PreGeneratedModel = dynamoose.model("pre_generated", schema);
