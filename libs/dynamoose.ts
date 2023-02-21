import * as dynamoose from "dynamoose";

const configuration = {
  region: <string>process.env.AWZ_WS_REGION,
  credentials: {
    accessKeyId: <string>process.env.AWZ_WS_ACCESS_KEY_ID,
    secretAccessKey: <string>process.env.AWZ_WS_SECRET_ACCESS_KEY,
  }
};

if (process.env.AWZ_WS_DYNAMODB_URL) {
  // @ts-ignore
  configuration.endpoint = <string>process.env.AWZ_WS_DYNAMODB_URL;
}

// Create new DynamoDB instance
const ddb = new dynamoose.aws.ddb.DynamoDB(configuration);
// Set DynamoDB instance to the Dynamoose DDB instance
dynamoose.aws.ddb.set(ddb);

dynamoose.Table.defaults.set({
  create: true,
  throughput: "ON_DEMAND",
  prefix: process.env.APP_ENV === "production" ? "prd_" : "dev_",
  suffix: "",
  waitForActive: process.env.APP_ENV !== "production",
  update: false,
});

export default dynamoose;
