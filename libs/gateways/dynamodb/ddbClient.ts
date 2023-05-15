import { DynamoDB, ScanInput } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocument, ScanCommand } from "@aws-sdk/lib-dynamodb";

const configuration = {
  region: process.env.AMZ_WS_REGION as string,
  credentials: {
    accessKeyId: process.env.AMZ_WS_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.AMZ_WS_SECRET_ACCESS_KEY as string,
  },
};

const marshallOptions = {
  // Whether to automatically convert empty strings, blobs, and sets to `null`.
  convertEmptyValues: false, // false, by default.
  // Whether to remove undefined values while marshalling.
  removeUndefinedValues: false, // false, by default.
  // Whether to convert typeof object to map attribute.
  convertClassInstanceToMap: false, // false, by default.
};

const unmarshallOptions = {
  // Whether to return numbers as a string instead of converting them to native JavaScript numbers.
  wrapNumbers: false, // false, by default.
};

const translateConfig = { marshallOptions, unmarshallOptions };

// Create an Amazon DynamoDB service client object.
export const ddbClient = new DynamoDB(configuration);

// Create the DynamoDB document client.
const ddbDocClient = DynamoDBDocument.from(ddbClient, translateConfig);

export async function scanRequest(params: ScanInput) {
  const command = new ScanCommand(params);
  // @ts-ignore
  return await ddbDocClient.send(command);
}

export async function statementRequest(Statement: string, Parameters: any[]) {
  return await ddbDocClient.executeStatement({ Statement, Parameters });
}