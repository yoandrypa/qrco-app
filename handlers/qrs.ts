import * as Qr from "../queries/qr";
import { CustomError } from "../utils";

interface Query {
  userId: string;
  limit?: any;
  skip?: any;
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
    const { limit, skip, search, all, userId } = query;

    const match = {
      ...(!all && { userId: { eq: userId } })
    };

    // @ts-ignore
    const [qrs, total] = await Qr.list(match, { limit, search, skip });
    // @ts-ignore

    for (const qr of qrs) {
      // @ts-ignore
      const index = qrs.indexOf(qr);
      // @ts-ignore
      qrs[index] = await qr.populate({ properties: qr.isDynamic ? ["shortLinkId", "qrOptionsId"] : "qrOptionsId" });
    }

    return {
      total,
      limit,
      skip,
      // @ts-ignore
      qrs
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
