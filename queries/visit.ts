// Create the DynamoDB service client module using ES6 syntax.
import {
  DynamoDBClient,
  ExecuteStatementCommand, ExecuteStatementCommandInput,
  ExecuteStatementCommandOutput
} from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
// Set the AWS Region.
const REGION = process.env.REACT_AWS_REGION; // For example, "us-east-1".
const CREDENTIALS = {
  accessKeyId: <string>process.env.REACT_AWS_ACCESS_KEY_ID,
  secretAccessKey: <string>process.env.REACT_AWS_SECRET_ACCESS_KEY
};
const configuration = {
  region: REGION,
  credentials: CREDENTIALS,
  apiVersion: "2012-08-10"
};
if (process.env.REACT_AWS_DYNAMODB_URL) {
  // @ts-ignore
  configuration["endpoint"] = <string>process.env.REACT_AWS_DYNAMODB_URL;
}

// Create an Amazon DynamoDB service client object.
const ddbClient = new DynamoDBClient(configuration);

export const find = async (key: { userId: string, createdAt: number }) => {
  try {
    const prefix: string = process.env.REACT_NODE_ENV === "production"
      ? "prd"
      : "dev";
    const input: ExecuteStatementCommandInput = {
      Statement: "SELECT * FROM " + prefix +
        "_visits WHERE userId=? and shortLinkId=?",
      // @ts-ignore
      Parameters: [marshall(key.userId), { "M": marshall(key) }]
    };

    const command: ExecuteStatementCommand = new ExecuteStatementCommand(input);
    const response: ExecuteStatementCommandOutput = await ddbClient.send(
      command);
    // @ts-ignore
    return unmarshall(response.Items[0]);
  } catch (e) {
    throw e;
  }
};
