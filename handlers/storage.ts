import { CustomError, toBytes } from "../utils";
import * as Storage from "../queries/storage";
import {QrDataModel} from "../models";

export const upload = async (assets: File[], customPath = "") => {
  try {
    let files: any[] = [];
    for (const asset of assets) {
      if (asset instanceof File) {
        const limitLargeFile: number = toBytes(100, "MB");
        let res;
        if (asset.size < limitLargeFile) {
          res = await Storage.upload(asset, customPath + "/" + asset.name);
        } else {
          res = await Storage.multipartUpload(asset, customPath + "/" + asset.name);
        }

        // @ts-ignore
        files.push({Key: res.Key, ContentLength: res.ContentLength, ContentType: res.ContentType, name: asset.name});
      } else {
        files.push(asset);
      }
    }
    return files;
  } catch (e) {
    // @ts-ignore
    throw new CustomError(e.message, 500, e);
  }
};

export const download = async (key: string) => {
  try {
    const data = Storage.download(key);

    let type = "";

    return await data.then((response) => {
      // @ts-ignore
      type = response.ContentType;

      // @ts-ignore
      const reader = response.Body.getReader();
      return new ReadableStream({
        start(controller) {
          return pump();

          function pump() { // @ts-ignore
            return reader.read().then(({ done, value }) => {
              // When no more data needs to be consumed, close the stream
              if (done) {
                controller.close();
                return;
              }
              // Enqueue the next data chunk into our target stream
              controller.enqueue(value);
              return pump();
            });
          }
        }
      });
    })
      // Create a new response out of the stream
      .then((stream) => new Response(stream))
      // Create an object URL for the response
      .then((response) => response.blob())
      .then((blob) => ({ content: URL.createObjectURL(blob.slice(0, blob.size, type)), type }))
      .catch((err) => console.error(err));
  } catch (e) {
    throw new CustomError("Error downloading file", 500, e);
  }
};

export const remove = async (keys: { Key: string }[]) => {
  try {
    return await Storage.remove(keys.map(key => ({Key: key.Key})));
  } catch (e) {
    throw e;
  }
};

export const get = async (userId: string, createdAt: number) => {
  try {
    return await QrDataModel.get({userId, createdAt});
  } catch (e) {
    throw e;
  }
}
