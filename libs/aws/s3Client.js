import {
  S3,
  GetBucketAccelerateConfigurationCommand,
  PutBucketAccelerateConfigurationCommand
} from "@aws-sdk/client-s3";


const region = process.env.REACT_AWS_REGION;
const accessKeyId = process.env.REACT_AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.REACT_AWS_SECRET_ACCESS_KEY;
export const s3Client = new S3({ region, credentials: { accessKeyId, secretAccessKey } });

let params = {
  "Bucket": String(process.env.REACT_AWS_BUCKET_NAME)
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
