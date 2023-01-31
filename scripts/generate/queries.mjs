import { PreGeneratedModel, LinkModel } from "./models.mjs";

export const batchPut = async (items) => {
  try {
    return await PreGeneratedModel.batchPut(items);
  } catch (e) {
    throw e;
  }
};

export const findByAddress = async (match) => {
  try {
    const resp = await LinkModel.query(match).using("addressIndex").exec();
    return resp;
  } catch (e) {
    throw e;
  }
};