import { QrDataModel } from "../models";
import dynamoose from "../libs/gateways/dynamodb/dynamoose";
import { CustomError } from "../utils";
import { LinkModel } from "../models";
import { QrOptionsModel } from "../models";
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

    const response = {...txResponse, creationDate};
    if (data.qrData.qrForSharing) {
      response.qrForSharing = data.qrData.qrForSharing;
    }

    return response;
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

    const btnIconsToRemove = [] as {Key: string;}[];

    for (let i = 0, l = qr.custom?.length || 0; i < l; i += 1) {
      const section = qr.custom[i];

      section.data?.links?.forEach((x: { icon: {Key: string;}[]; }) => {
        if (x.icon?.[0]?.Key !== undefined) { btnIconsToRemove.push({Key: x.icon[0].Key}); }
      });

      if (["video", "gallery", "pdf", "audio"].includes(section.component) && section.data?.files?.length) {
        promises.push(StorageHandler.remove(section.data.files));
      }
    }

    if (btnIconsToRemove.length > 0) {
      promises.push(StorageHandler.remove(btnIconsToRemove));
    }
    if (["video", "gallery", "pdf", "audio"].includes(qr.qrType) && qr.files?.length) {
      promises.push(StorageHandler.remove(qr.files));
    }
    if (qr.backgndImg) {
      promises.push(StorageHandler.remove(qr.backgndImg));
    }
    if (qr.foregndImg) {
      promises.push(StorageHandler.remove(qr.foregndImg));
    }
    if (qr.micrositeBackImage) {
      promises.push(StorageHandler.remove(qr.micrositeBackImage));
    }
    if (qr.qrForSharing) {
      promises.push(StorageHandler.remove(qr.qrForSharing));
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

export const getBySecret = async (secret: string, skipPopulate?: boolean) => {
  try {
    const resp = await QrDataModel.scan({'secret': {'eq': secret}}).exec();

    if (resp?.[0] === undefined) {
      return undefined;
    }

    if (skipPopulate) {
      return resp[0];
    }

    if (resp[0].secretOps?.includes('e')) {
      return undefined;
    }

    // @ts-ignore
    const extraData = await resp.populate(['shortLinkId', 'qrOptionsId']); // @ts-ignore
    return extraData[0];
  } catch (e) {
    throw e;
  }
}
