import { QrDataModel } from "../models/qr/QrDataModel";
import dynamoose from "../libs/dynamoose";
import { CustomError } from "../utils";
import { LinkModel } from "../models/link";
import { QrOptionsModel } from "../models/qr/QrOptionsModel";
import { ObjectType } from "dynamoose/dist/General";
import * as StorageHandler from "../handlers/storage";

export const create = async (data: { shortLink: ObjectType; qrDesign: ObjectType; qrData: ObjectType; }) => {
  try {
    let transactions = [];
    if (data.shortLink) {
      transactions.push(LinkModel.transaction.create(data.shortLink));
    }
    if (data.qrDesign) {
      transactions.push(QrOptionsModel.transaction.create(data.qrDesign));
    }
    const creationDate = Date.now();
    if (data.qrData) {
      data.qrData.createdAt = creationDate;
      transactions.push(QrDataModel.transaction.create(data.qrData));
    }

    const txResponse = await dynamoose.transaction(transactions);

    return {...txResponse, creationDate};
  } catch (e) {
    throw e;
  }
};

export const count = async (match: Partial<QrDataQueryType>, params: ListParams) => {
  try {
    const query = QrDataModel.query(match);

    /*if (params.search) {
      query.and().parenthesis(
        new dynamoose.Condition()
          .where("description")
          .contains(params.search)
          .or()
          .where("address")
          .contains(params.search)
          .or()
          .where("target")
          .contains(params.search)
      );
    }*/

    const result = await query.count().exec();

    return result.count;
  } catch (e) {
    throw e;
  }
};

interface ListParams {
  limit?: number;
  search?: string;
  startAt?: ObjectType;
  sort?: "ascending" | "descending";
}

export const list = async (match: Partial<QrDataQueryType>, params: ListParams) => {
  try {
    //TODO include the Skip param
    const query = QrDataModel.query(match);

    /*if (params.search) {
      query.and().parenthesis(
        new dynamoose.Condition()
          .where("description")
          .contains(params.search)
          .or()
          .where("address")
          .contains(params.search)
          .or()
          .where("target")
          .contains(params.search)
      );
    }*/

    //query.limit(params.limit || 10).sort(params.sort || "descending");
    query.sort(params.sort || "descending");

    if (params.startAt) {
      query.startAt(params.startAt);
    }

    const results = await query.exec();

    return [results, results.lastKey];
  } catch (e) {
    throw e;
  }
};

export const get = async (key: { userId: string, createdAt: number }) => {
  try {
    return await QrDataModel.get(key);
  } catch (e) {
    throw e;
  }
};

export const find = async (condition: any) => {
  try {
    return await QrDataModel.query(condition).exec()
  } catch (e) {
    throw e;
  }
};

// @ts-ignore
export const update = async (data) => {
  try {
    let transactions = [];
    const { shortLinkId, qrOptionsId, ...qrData } = data;
    if (shortLinkId) {
      const { userId, createdAt, ...rest } = shortLinkId;
      transactions.push(LinkModel.transaction.update({ userId, createdAt }, rest));
    }
    if (qrOptionsId) {
      const { id, ...rest } = qrOptionsId;
      let propsToRemove: string[] = [];
      Object.keys(rest).forEach((key) => {
        if (rest[key] === undefined) {
          propsToRemove.push(key);
          delete rest[key];
        }
      });
      if (propsToRemove.length) {
        rest["$REMOVE"] = propsToRemove;
      }
      transactions.push(QrOptionsModel.transaction.update(id, rest));
    }
    if (qrData) {
      const { userId, createdAt, ...rest } = qrData;
      transactions.push(QrDataModel.transaction.update({ userId, createdAt }, rest));
    }
    return await dynamoose.transaction(transactions);
  } catch (e) {
    throw e;
  }
};

export const remove = async (key: { userId: string, createdAt: number }) => {
  try {
    const qr = await QrDataModel.get(key);

    if (!qr) {
      throw new CustomError("QR Code was not found.");
    }

    let transactions = [];
    if (qr.shortLinkId) {
      // @ts-ignore
      const shortLink = (await qr.populate({ properties: "shortLinkId" })).shortLinkId;
      const createdAt = (new Date(shortLink.createdAt)).getTime();
      transactions.push(LinkModel.transaction.delete({ userId: shortLink.userId, createdAt }));
    }
    if (qr.qrOptionsId) {
      transactions.push(QrOptionsModel.transaction.delete(qr.qrOptionsId));
    }
    const createdAt = (new Date(qr.createdAt)).getTime();
    transactions.push(QrDataModel.transaction.delete({ userId: qr.userId, createdAt }));
    const promises = [dynamoose.transaction(transactions)];
    if (["video", "gallery", "pdf", "audio"].includes(qr.qrType)) {
      promises.push(StorageHandler.remove(qr.files));
    }
    if (qr.backgndImg) {
      promises.push(StorageHandler.remove(qr.backgndImg));
    }
    if (qr.foregndImg) {
      promises.push(StorageHandler.remove(qr.foregndImg));
    }

    return Promise.all(promises).then(() => {
      return true;
    }).catch(e => {
      if (e.message == "key is undefined") {
        return true;
      }
      throw e;
    });
  } catch (e) {
    throw e;
  }
};
