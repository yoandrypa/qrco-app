// Create the DynamoDB service client module using ES6 syntax.
import {
  DynamoDBClient,
  ExecuteStatementCommand, ExecuteStatementCommandInput,
  ExecuteStatementCommandOutput
} from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
// Set the AWS Region.
const REGION = process.env.AMZ_WS_REGION; // For example, "us-east-1".
const CREDENTIALS = {
  accessKeyId: <string>process.env.AMZ_WS_ACCESS_KEY_ID,
  secretAccessKey: <string>process.env.AMZ_WS_SECRET_ACCESS_KEY
};
const configuration = {
  region: REGION,
  credentials: CREDENTIALS,
  apiVersion: "2012-08-10"
};
if (process.env.AMZ_WS_DYNAMODB_URL) {
  // @ts-ignore
  configuration["endpoint"] = <string>process.env.AMZ_WS_DYNAMODB_URL;
}

// Create an Amazon DynamoDB service client object.
const ddbClient = new DynamoDBClient(configuration);

export const find = async (key: { userId: string, createdAt: number }) => {
  try {
    const prefix: string = process.env.APP_ENV === "production" ? "prd" : "dev";
    const statement = `SELECT * FROM ${prefix}_visits WHERE userId='${key.userId}' AND shortLinkId.userId='${key.userId}' AND shortLinkId.createdAt=${key.createdAt}`;

    /*const statement = `SELECT * FROM ${prefix}_visits WHERE userId='${key.userId}' AND shortLinkId=?`
    const input: ExecuteStatementCommandInput = { Statement: statement, Parameters: [{ "M": marshall(key) }]};

    const input: ExecuteStatementCommandInput = {Statement: statement};

    const command: ExecuteStatementCommand = new ExecuteStatementCommand(input);
    const response: ExecuteStatementCommandOutput = await ddbClient.send(command);*/

    const response = await ddbClient.send(new ExecuteStatementCommand({Statement: statement}));

    // @ts-ignore
    return response.Items[0] ? unmarshall(response.Items[0]) : null;
  } catch (e) {
    throw e;
  }
};
