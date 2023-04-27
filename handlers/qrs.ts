import * as Qr from "../queries/qr";
import { CustomError } from "../utils";
import * as Link from "../queries/link";
import {getBySecret} from "../queries/qr";
import {customAlphabet} from "nanoid";
import {generateUUID} from "listr2/dist/utils/uuid";

// @ts-ignore
export const create = async (data) => {
  try {
    if (data.qrDesign) {
      if (data.qrDesign.image === null) {
        data.qrDesign.image = "";
      }
    }

    if (data.qrData.mode !== undefined) {
      delete data.qrData.mode;
    }

    return await Qr.create(data);
  } catch (e: any) {
    throw new CustomError(e.message, 500, e);
  }
};

export interface Query {
  userId: string;
  limit?: any;
  startAt?: Object;
  search?: any;
  all?: any;
}

export const list = async (query: Query) => {
  try {
    const { limit, startAt, search, all, userId } = query;

    const match = {
      ...(!all && { userId: { eq: userId } }),
    };

    // @ts-ignore
    let [items, lastKey] = await Qr.list(match, { limit, search, startAt });

    //const count = await Qr.count(match, { search });

    // @ts-ignore
    items = await items.populate(
      { properties: ["shortLinkId", "qrOptionsId"] });

    return {
      //count,
      limit,
      lastKey,
      // @ts-ignore
      items,
    };
  } catch (e: any) {
    throw new CustomError(e.message, 500, e);
  }
};

export const get = async (key: { userId: string, createdAt: number }) => {
  try {
    return await Qr.get(key);
  } catch (e: any) {
    throw new CustomError(e.message, 500, e);
  }
};

export const findByShortLink = async (shortLinkId: { userId: string, createdAt: number }) => {
  try {
    return await Qr.find(
      { userId: { eq: shortLinkId.userId }, shortLinkId: { eq: shortLinkId } });
  } catch (e: any) {
    throw new CustomError(e.message, e.statusCode || 500, e);
  }
};

export const edit = async (data: QrDataType) => {
  try {
    let { userId, createdAt, ...rest } = data;

    if (typeof createdAt !== "number") {
      createdAt = (new Date(createdAt)).getTime();
    }

    const qr = await Qr.get({ userId, createdAt });

    if (!qr) {
      throw new CustomError("QR code was not found.");
    }
    // @ts-ignore
    rest.qrOptionsId.id = qr.qrOptionsId;
    if (rest.shortLinkId) {
      const { userId, createdAt } = qr.shortLinkId;
      // @ts-ignore
      rest.shortLinkId = { ...rest.shortLinkId, userId, createdAt };
    }

    //Removing undefined attributes
    const attributesToRemove: string[] = [];
    Object.keys(rest).forEach(key => {
      // @ts-ignore
      if (rest[key] === undefined) {
        // @ts-ignore
        delete rest[key];
        attributesToRemove.push(key);
      }
    });
    if (attributesToRemove.length > 0) {
      // @ts-ignore
      rest["$REMOVE"] = attributesToRemove;
    }

    // Update QR
    const updatedLink = await Qr.update({ userId, createdAt, ...rest });

    // @ts-ignore
    return { ...qr, ...updatedLink };
  } catch (e: any) {
    throw new CustomError(e.message, 500, e);
  }
};

export const remove = async (key: { userId: string, createdAt: number }) => {
  try {
    if (typeof key["createdAt"] !== "number") {
      key["createdAt"] = (new Date(key["createdAt"])).getTime();
    }

    const qr = await Qr.remove(key);

    if (!qr) {
      throw new CustomError("Could not delete the qr");
    }

    return { message: "Qr has been deleted successfully." };
  } catch (e: any) {
    throw new CustomError(e.message, 500, e);
  }
};

export const pauseQRLink = async (
  shortLinkId: { userId: string, createdAt: number, paused: boolean }) => {
  try {
    const paused = !shortLinkId.paused;
    return await Link.update({
      userId: shortLinkId.userId,
      createdAt: (new Date(shortLinkId.createdAt)).getTime(),
    }, {
      paused, pausedById: paused ? shortLinkId.userId : undefined
    });
  } catch (e: any) {
    throw new CustomError(e.message, e.statusCode || 500, e);
  }
};

export const getItemBySecret = async (secret: string) => {
  try {
    return await Qr.getBySecret(secret);
  } catch (e: any) {
    throw new CustomError(e.message, e.statusCode || 500, e);
  }
}

// @ts-ignore
export const generateSecret = async () => {
  try {
    const nanoid = customAlphabet("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890_", 10);
    const newSecret = nanoid();

    const data = await Qr.getBySecret(newSecret, true);
    if (Boolean(data)) {
      return await generateSecret();
    }
    return newSecret;
  } catch (e: any) {
    throw new CustomError(e.message, e.statusCode || 500, e);
  }
}
