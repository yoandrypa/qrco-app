//const useragent = require("useragent");
import * as Visit from "../queries/visit";
import { CustomError } from "../utils";

export const findByShortLink = async (shortLinkId: { userId: string, createdAt: number }) => {
  try {
    const res = await Visit.find(shortLinkId);
    console.debug({ res });
    return res;
  } catch (e: any) {
    throw new CustomError(e.message, e.statusCode || 500, e);
  }
};
