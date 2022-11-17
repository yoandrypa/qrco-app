import * as Qr from "../queries/qr";
import { CustomError } from "../utils";

export interface Query {
  userId: string;
  limit?: any;
  startAt?: Object;
  search?: any;
  all?: any;
}

// @ts-ignore
export const create = async (data) => {
  try {
    if (data.qrDesign) {
      if (data.qrDesign.image === null) {
        data.qrDesign.image = "";
      }
    }

    return await Qr.create(data);
  } catch (e: any) {
    throw new CustomError(e.message);
  }
};

export const list = async (query: Query) => {
  try {
    const { limit, startAt, search, all, userId } = query;

    const match = {
      ...(!all && { userId: { eq: userId } })
    };

    // @ts-ignore
    const [items, lastKey] = await Qr.list(match, { limit: limit || 5, search, startAt });
    // @ts-ignore

    for (const qr of items) {
      // @ts-ignore
      const index = items.indexOf(qr);
      // @ts-ignore
      items[index] = await qr.populate({ properties: qr.isDynamic ? ["shortLinkId", "qrOptionsId"] : "qrOptionsId" });
    }

    const count = await Qr.count(match, {search})

    return {
      count,
      limit: limit || 5,
      lastKey,
      // @ts-ignore
      items
    };
  } catch (e: any) {
    throw new CustomError(e.message);
  }
};

export const get = async (key: { userId: string, createdAt: number }) => {
  try {
    return await Qr.get(key);
  } catch (e: any) {
    throw new CustomError(e.message);
  }
};

export const edit = async (data: QrDataType) => {
  try {
    let { userId, createdAt, ...rest } = data;

    if (typeof createdAt === "string") {
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
    if (typeof key["createdAt"] === "string") {
      key["createdAt"] = (new Date(key["createdAt"])).getTime();
    }

    const qr = await Qr.remove(key);

    if (!qr) {
      throw new CustomError("Could not delete the qr");
    }

    return { message: "Qr has been deleted successfully." };
  } catch (e: any) {
    throw new CustomError(e.message);
  }
};
