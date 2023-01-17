//const useragent = require("useragent");
import * as Visit from "../queries/visit";
import { CustomError } from "../utils";

export const findByShortLink = async (shortLinkId: { userId: string, createdAt: number }) => {
  try {
    return await Visit.find(shortLinkId);
  } catch (e: any) {
    throw new CustomError(e.message, e.statusCode || 500, e);
  }
};
