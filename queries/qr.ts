import { QrDataModel } from "../models/qr/QrDataModel";
import dynamoose from "../libs/dynamoose";
import { CustomError } from "../utils";
import { LinkModel } from "../models/link";
import { QrOptionsModel } from "../models/qr/QrOptionsModel";
import { ObjectType } from "dynamoose/dist/General";
import * as StorageHandler from "../handlers/storage";

interface TotalParams {
  search?: string;
}

export const total = async (
  match: Match<LinkQueryType>,
  params: TotalParams = {}
) => {
  try {
    const query = QrDataModel.scan(match);

    if (params.search) {
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
    }

    const result = await query.count().exec();

    return typeof result.count === "number"
      ? result.count
      : parseInt(result.count);
  } catch (e) {
    // @ts-ignore
    throw new CustomError(e.message, 500, e);
  }
};

interface GetParams {
  limit: number;
  search?: string;
  skip?: number;
}

export const get = async (match: Partial<QrDataQueryType>, params: GetParams) => {
  try {
    //TODO include the Skip param
    const query = QrDataModel.scan(match);

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

    const results = await query.exec(); //query.limit(params.limit || 10).exec();
    // @ts-ignore
    const qrs: QrDataType[] = results;

    return [qrs, results.count];
  } catch (e) {
    // @ts-ignore
    throw new CustomError(e.message, 500, e);
  }
};

export const find = async (match: Partial<QrDataQueryType>): Promise<any> => {
  try {
    return await QrDataModel.findOne(match);
  } catch (e) {
    // @ts-ignore
    throw new CustomError(e.message, 500, e);
  }
};

interface Create extends Partial<QrDataType> {
  qrName: string;
  qrType: string;
  userId: string;
}

export const create = async (data: { shortLink: ObjectType; qrDesign: ObjectType; qrData: ObjectType; }) => {
  try {
    let transactions = [];
    if (data.shortLink) {
      transactions.push(LinkModel.transaction.create(data.shortLink));
    }
    if (data.qrDesign) {
      transactions.push(QrOptionsModel.transaction.create(data.qrDesign));
    }
    if (data.qrData) {
      transactions.push(QrDataModel.transaction.create(data.qrData));
    }
    return await dynamoose.transaction(transactions);
  } catch (e) {
    // @ts-ignore
    throw new CustomError(e.message, 500, e);
  }
};

export const remove = async (match: Partial<QrDataType>) => {
  try {
    const qr = await QrDataModel.findOne({
      id: { eq: match.id },
      userId: { eq: match.userId }
    });

    if (!qr) {
      throw new CustomError("QR Code was not found.");
    }

    let transactions = [];
    if (qr.shortLinkId) {
      transactions.push(LinkModel.transaction.delete(qr.shortLinkId));
    }
    if (qr.qrOptionsId) {
      transactions.push(QrOptionsModel.transaction.delete(qr.qrOptionsId));
    }
    transactions.push(QrDataModel.transaction.delete(qr.id));
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
    // @ts-ignore
    throw new CustomError(e.message, 500, e);
  }
};

// @ts-ignore
export const update = async (data) => {
  try {
    let transactions = [];
    const { shortLinkId, qrOptionsId, ...qrData } = data;
    if (shortLinkId) {
      const { id, ...rest } = shortLinkId;
      transactions.push(await LinkModel.transaction.update(id, rest));
    }
    if (qrOptionsId) {
      const { id, ...rest } = qrOptionsId;
      transactions.push(await QrOptionsModel.transaction.update(id, rest));
    }
    if (qrData) {
      const { id, ...rest } = qrData;
      transactions.push(await QrDataModel.transaction.update(id, rest));
    }
    return await dynamoose.transaction(transactions);
  } catch (e) {
    // @ts-ignore
    throw new CustomError(e.message, 500, e);
  }
};
