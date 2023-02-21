import {
  S3,
  GetBucketAccelerateConfigurationCommand,
  PutBucketAccelerateConfigurationCommand
} from "@aws-sdk/client-s3";


const region = process.env.AWZ_WS_REGION;
const accessKeyId = process.env.AWZ_WS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWZ_WS_SECRET_ACCESS_KEY;
export const s3Client = new S3({ region, credentials: { accessKeyId, secretAccessKey } });

let params = {
  "Bucket": String(process.env.AWZ_WS_BUCKET_NAME)
};

let command = new GetBucketAccelerateConfigurationCommand(params);

s3Client.send(command).then(response => {
  if (!response.Status || response.Status !== "Enabled") {
    params["AccelerateConfiguration"] = {
      Status: "Enabled"
    };
    command = new PutBucketAccelerateConfigurationCommand(params);
    s3Client.send(command).catch(e => {
      throw e;
    });
  }
});
