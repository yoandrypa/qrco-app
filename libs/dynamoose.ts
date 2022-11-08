import * as dynamoose from "dynamoose";
import { DynamoDBClientConfig } from "@aws-sdk/client-dynamodb";

const configuration: DynamoDBClientConfig = {
  region: <string>process.env.REACT_AWS_REGION,
  credentials: {
    accessKeyId: <string>process.env.REACT_AWS_ACCESS_KEY_ID,
    secretAccessKey: <string>process.env.REACT_AWS_SECRET_ACCESS_KEY
  }
};

if (process.env.REACT_AWS_DYNAMODB_URL) {
  configuration.endpoint = process.env.REACT_AWS_DYNAMODB_URL;
}

// Create new DynamoDB instance
const ddb = new dynamoose.aws.ddb.DynamoDB(configuration);
// Set DynamoDB instance to the Dynamoose DDB instance
dynamoose.aws.ddb.set(ddb);

dynamoose.Table.defaults.set({
  create: true,
  throughput: {
    read: 5,
    write: 5
  },
  prefix: process.env.REACT_NODE_ENV === "production" ? "prd_" : "dev_",
  suffix: "",
  waitForActive: process.env.REACT_NODE_ENV !== "production",
  update: true,
  populate: false,
  expires: undefined
});

export default dynamoose;
