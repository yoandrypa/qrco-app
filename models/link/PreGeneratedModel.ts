import dynamoose from "../../libs/dynamoose";
import { generateId } from "../../utils";

// instantiate a dynamoose schema
const PreGeneratedSchema = new dynamoose.Schema({
  id: {
    type: String,
    hashKey: true,
    default: generateId(null, 5),
  },
});

// create a model from schema and export it
export const PreGeneratedModel = dynamoose.model("pre_generated",
  PreGeneratedSchema);
