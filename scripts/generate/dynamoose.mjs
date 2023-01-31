import * as dynamoose from "dynamoose";

const configuration = {
  region: process.env.REACT_AWS_REGION,
  credentials: {
    accessKeyId: process.env.REACT_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.REACT_AWS_SECRET_ACCESS_KEY,
  },
};

if (process.env.REACT_AWS_DYNAMODB_URL) {
  configuration.endpoint = process.env.REACT_AWS_DYNAMODB_URL;
}

// Create new DynamoDB instance
const ddb = new dynamoose.default.aws.ddb.DynamoDB(configuration);
// Set DynamoDB instance to the Dynamoose DDB instance
dynamoose.default.aws.ddb.set(ddb)

dynamoose.Table.defaults.set({
  create: true,
  throughput: "ON_DEMAND",
  prefix: process.env.REACT_NODE_ENV === "production" ? "prd_" : "dev_",
  suffix: "",
  waitForActive: process.env.REACT_NODE_ENV !== "production",
  update: false,
});

export default dynamoose;
