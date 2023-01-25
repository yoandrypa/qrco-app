import { PreGeneratedModel } from "../models";

export const get = async (key: string) => {
  try {
    return await PreGeneratedModel.get(key);
  } catch (e) {
    throw e;
  }
};