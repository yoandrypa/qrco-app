import { batchPut, findByAddress } from "./queries.mjs";

export const saveCodes = async (codes) => {
  try {
    return await batchPut(codes);
  } catch (e) {
    throw e;
  }
};

export const findLink = async (match) => {
  try {
    return await findByAddress(match);
  } catch (e) {
    throw e;
  }
};