//const useragent = require("useragent");
import * as Visit from "../queries/visit";
import { CustomError } from "../utils";

export const findByShortLink = async (shortLinkId: { userId: string, createdAt: number }) => {
  try {
    return await Visit.find({ userId: { eq: shortLinkId.userId }, shortLinkId: { eq: shortLinkId } });
  } catch (e: any) {
    throw new CustomError(e.message, e.statusCode || 500, e);
  }
};
