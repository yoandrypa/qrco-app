import * as PreGenerated from "../queries/preGenerated";
import { CustomError } from "../utils";

export const get = async (key: string) => {
  try {
    return await PreGenerated.get(key);
  } catch (e: any) {
    throw new CustomError(e.message, e.statusCode || 500, e);
  }
};
