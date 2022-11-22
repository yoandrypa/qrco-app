//const useragent = require("useragent");

import { CustomError } from "../utils";

export const getByShortLink = async (shortLinkId: { userId: string, createdAt: number }) => {
  try {
    return;
  } catch (e: any) {
    throw new CustomError(e.message, e.statuscode || 500, e);
  }
};
