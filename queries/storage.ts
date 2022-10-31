import { s3Client } from "../libs";
import {
  PutObjectCommand,
  PutObjectCommandInput,
  GetObjectCommand,
  GetObjectCommandInput,
  DeleteObjectsCommand,
  DeleteObjectsCommandInput,
  ObjectIdentifier,
  CompleteMultipartUploadCommand,
  CompleteMultipartUploadCommandInput,
  CreateMultipartUploadCommand,
  CreateMultipartUploadCommandInput,
  UploadPartCommand,
  UploadPartCommandInput,
  CompleteMultipartUploadCommandOutput,
  HeadObjectCommandInput,
  HeadObjectCommand
} from "@aws-sdk/client-s3";

export const checkIfExist: (key: string) => Promise<any> = async (key: string) => {
  try {
    const input: HeadObjectCommandInput = {
      Bucket: String(process.env.REACT_AWS_BUCKET_NAME),
      Key: key
    };
    const command: HeadObjectCommand = new HeadObjectCommand(input);
    return await s3Client.send(command);
  } catch (e) {
    return e;
  }
};

export const upload = async (file: File, key = "") => {
  try {
    let response = await checkIfExist(key);
    if (response.$metadata.httpStatusCode === 404) {
      const input: PutObjectCommandInput = {
        Bucket: String(process.env.REACT_AWS_BUCKET_NAME),
        Body: Buffer.from(await file.arrayBuffer()),
        Key: key,
        ContentLength: file.size,
        ContentType: file.type
      };
      const command: PutObjectCommand = new PutObjectCommand(input);
      response = await s3Client.send(command);
    }
    return {
      ...response,
      Key: key
    };
  } catch (e) {
    return e;
  }
};

export const multipartUpload = async (file: File, key = ""): Promise<CompleteMultipartUploadCommandOutput> => {
  try {
    let response = await checkIfExist(key);
    if (response.$metadata.httpStatusCode === 200) {
      return {
        ...response,
        Key: key
      };
    }
    const Bucket = String(process.env.REACT_AWS_BUCKET_NAME);
    const Key = key;
    const input: CreateMultipartUploadCommandInput = {
      Bucket,
      Key,
      ContentType: file.type
    };
    const createUploadResponse = await s3Client.send(
      new CreateMultipartUploadCommand(input)
    );
    const { UploadId } = createUploadResponse;
    console.log("Upload initiated. Upload ID: ", UploadId);

    const buffer = Buffer.from(await file.arrayBuffer());

    // 5MB is the minimum part size
    // Last part can be any size (no min.)
    // Single part is treated as last part (no min.)
    const partSize = (1024 * 1024) * 5; // 5MB
    const bufferSize = buffer.length;
    const numParts = Math.ceil(bufferSize / partSize);

    const uploadedParts = [];
    let remainingBytes = bufferSize;

    for (let i = 1; i <= numParts; i++) {
      let startOfPart = bufferSize - remainingBytes;
      let endOfPart = Math.min(partSize, startOfPart + remainingBytes);

      if (i > 1) {
        endOfPart = startOfPart + Math.min(partSize, remainingBytes);
        startOfPart += 1;
      }

      const uploadParams: UploadPartCommandInput = {
        // add 1 to endOfPart due to slice end being non-inclusive
        Body: buffer.subarray(startOfPart, endOfPart + 1),
        Bucket,
        Key,
        UploadId,
        PartNumber: i
      };
      const uploadPartResponse = await s3Client.send(new UploadPartCommand(uploadParams));
      console.log(`Part #${i} uploaded. ETag: `, uploadPartResponse.ETag);

      remainingBytes -= Math.min(partSize, remainingBytes);

      // For each part upload, you must record the part number and the ETag value.
      // You must include these values in the subsequent request to complete the multipart upload.
      // https://docs.aws.amazon.com/AmazonS3/latest/API/API_CompleteMultipartUpload.html
      uploadedParts.push({ PartNumber: i, ETag: uploadPartResponse.ETag });
    }

    const completeParams: CompleteMultipartUploadCommandInput = {
      Bucket,
      Key,
      UploadId,
      MultipartUpload: {
        Parts: uploadedParts
      }
    };
    console.log("Completing upload...");
    const completeData = await s3Client.send(new CompleteMultipartUploadCommand(completeParams));
    console.log("Upload complete: ", completeData.Key, "\n---");
    return completeData;
  } catch (e) {
    throw e;
  }
};

export const download = async (key: string) => {
  try {
    const downloadParams: GetObjectCommandInput = {
      Key: key,
      Bucket: String(process.env.REACT_AWS_BUCKET_NAME)
    };
    const command: GetObjectCommand = new GetObjectCommand(downloadParams);
    return await s3Client.send(command);
  } catch (e) {
    return e;
  }
};

export const remove = async (keys: ObjectIdentifier[]) => {
  try {
    const deleteParams: DeleteObjectsCommandInput = {
      Bucket: String(process.env.REACT_AWS_BUCKET_NAME),
      Delete: {
        Objects: keys,
        Quiet: true
      }
    };
    const command: DeleteObjectsCommand = new DeleteObjectsCommand(deleteParams);
    return await s3Client.send(command);
  } catch (e) {
    return e;
  }
};
