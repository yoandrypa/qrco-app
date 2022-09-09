import queries from "../queries";
import { CreateQrDataType, UpdateQrDataType } from "./types";
import { CustomError } from "../utils";

interface Query {
  userId: string;
  limit?: any;
  skip?: any;
  search?: any;
  all?: any;
}

export const create = async (data: CreateQrDataType) => {
  try {
    return await queries.qr.create(data);
  } catch (e) {
    // @ts-ignore
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
    const [qrs, total] = await queries.qr.get(match, { limit, search, skip });

    return {
      total,
      limit,
      skip,
      qrs
    };
  } catch (e) {
    // @ts-ignore
    throw new CustomError(e.message);
  }
};

export const get = async (id: string) => {
  try {
    return await queries.qr.find({ id: { eq: id } });
  } catch (e) {
    // @ts-ignore
    throw new CustomError(e.message);
  }
};

export const edit = async (data: UpdateQrDataType) => {
  try {
    const { id, userId, ...rest } = data;

    const qr = await queries.qr.find({
      id: { eq: id },
      userId: { eq: userId }
    });

    if (!qr) {
      throw new CustomError("QR code was not found.");
    }

    // Update QR
    const updatedLink = await queries.qr.update(
      {
        id: qr.id
      },
      { ...rest }
    );

    // @ts-ignore
    return { ...qr, ...updatedLink };
  } catch (e) {
    // @ts-ignore
    throw new CustomError(e.message, 500, e);
  }
};

export const remove = async (params: { id: any; userId?: any; }) => {
  try {
    const link = await queries.link.remove({
      id: params.id,
      userId: params.userId
    });

    if (!link) {
      throw new CustomError("Could not delete the link");
    }

    return { message: "LinkModel has been deleted successfully." };
  } catch (e) {
    // @ts-ignore
    throw new CustomError(e.message);
  }
};
