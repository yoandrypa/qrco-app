import dynamoose from "../../libs/dynamoose";

// instantiate a dynamoose schema
const PreGeneratedSchema = new dynamoose.Schema({
  code: {
    type: String,
    hashKey: true,
    required: true,
  },
});

// create a model from schema and export it
export const PreGeneratedModel = dynamoose.model("pre_generated",
  PreGeneratedSchema);
