import { s3Client } from "../libs";
import {
  PutObjectCommandInput,
  GetObjectCommandInput,
  DeleteObjectsCommandInput,
  ObjectIdentifier,
  CompleteMultipartUploadCommandInput,
  CreateMultipartUploadCommandInput,
  UploadPartCommandInput,
  CompleteMultipartUploadCommandOutput,
  GetObjectAttributesCommandInput,
  GetObjectAttributesCommandOutput
} from "@aws-sdk/client-s3";

const uc = require("unix-checksum");

export const checkIfExist = async (key: string, checkSum?: string) => {
  try {
    const input: GetObjectAttributesCommandInput = {
      Bucket: String(process.env.AMZ_WS_BUCKET_NAME),
      Key: key,
      ObjectAttributes: ["Checksum"]
    };
    //const command: HeadObjectCommand = new HeadObjectCommand(input);
    const response: GetObjectAttributesCommandOutput = await s3Client.getObjectAttributes(input);
    if (!checkSum) {
      return response; //TODO temporal fix for multipart upload
    } else if (response.Checksum?.ChecksumCRC32C !== checkSum) {
      return false;
    }
    return response;
  } catch (e: any) {
    if (e.$metadata.httpStatusCode === 404) {
      return false;
    }
    throw e;
  }
};

export const upload = async (file: File, key: string) => {
  try {
    const body = Buffer.from(await file.arrayBuffer());
    const checkSum = uc.crc32c(body, "base64");
    let response = await checkIfExist(key, checkSum);
    if (!response) {
      const input: PutObjectCommandInput = {
        Bucket: String(process.env.AMZ_WS_BUCKET_NAME),
        Body: body,
        Key: key,
        ContentLength: file.size,
        ContentType: file.type,
        ChecksumAlgorithm: "CRC32C",
        ChecksumCRC32C: checkSum
      };
      response = await s3Client.putObject(input);
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
    const buffer = Buffer.from(await file.arrayBuffer());
    //const checkSum = uc.crc32c(buffer, "base64");
    let response = await checkIfExist(key);
    if (response) {
      return {
        ...response,
        Key: key
      };
    }
    const Bucket = String(process.env.AMZ_WS_BUCKET_NAME);
    const Key = key;
    const input: CreateMultipartUploadCommandInput = {
      Bucket,
      Key,
      ContentType: file.type
      //ChecksumAlgorithm: "CRC32C"
    };
    const createUploadResponse = await s3Client.createMultipartUpload(input);
    const { UploadId } = createUploadResponse;
    console.log("Upload initiated. Upload ID: ", UploadId);

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

      const bufferPart = buffer.subarray(startOfPart, endOfPart + 1);
      //const checkSum = uc.crc32c(bufferPart, "base64");
      const uploadParams: UploadPartCommandInput = {
        // add 1 to endOfPart due to slice end being non-inclusive
        Body: bufferPart,
        Bucket,
        Key,
        UploadId,
        PartNumber: i
        //ChecksumAlgorithm: "CRC32C",
        //ChecksumCRC32C: checkSum
      };
      const uploadPartResponse = await s3Client.uploadPart(uploadParams);
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
      //ChecksumCRC32C: uc.crc32c(checkSums, "base64")
    };
    console.log("Completing upload...");
    const completeData = await s3Client.completeMultipartUpload(completeParams);
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
      Bucket: String(process.env.AMZ_WS_BUCKET_NAME)
    };
    return await s3Client.getObject(downloadParams);
  } catch (e) {
    return e;
  }
};

export const remove = async (keys: ObjectIdentifier[]) => {
  try {
    const deleteParams: DeleteObjectsCommandInput = {
      Bucket: String(process.env.AMZ_WS_BUCKET_NAME),
      Delete: {
        Objects: keys,
        Quiet: true
      }
    };
    return await s3Client.deleteObjects(deleteParams);
  } catch (e) {
    return e;
  }
};
