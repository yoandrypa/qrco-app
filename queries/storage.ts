import { s3Client } from "../libs";
import {
  PutObjectCommand,
  PutObjectCommandInput,
  GetObjectCommand,
  GetObjectCommandInput,
  DeleteObjectCommand, DeleteObjectCommandInput
} from "@aws-sdk/client-s3";

export const upload = async (file: File, path: string = "") => {
  try {
    const uploadParams: PutObjectCommandInput = {
      Bucket: String(process.env.REACT_AWS_BUCKET_NAME),
      Body: file,
      Key: path + "/" + file.name,
      ContentLength: file.size,
      ContentType: file.type
    };
    const command: PutObjectCommand = new PutObjectCommand(uploadParams);
    const response = await s3Client.send(command);
    return {
      ...response,
      Key: path + "/" + file.name
    };
  } catch (e) {
    return e;
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

export const remove = async (key: string) => {
  try {
    const deleteParams: DeleteObjectCommandInput = {
      Key: key,
      Bucket: String(process.env.REACT_AWS_BUCKET_NAME)
    };
    const command: DeleteObjectCommand = new DeleteObjectCommand(deleteParams);
    return await s3Client.send(command);
  } catch (e) {
    return e;
  }
};
