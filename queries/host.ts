import { HostModel as HostModel } from "../models/link";

interface Add extends Partial<HostType> {
  address: string;
}

export const find = async (match: Partial<HostQueryType>): Promise<any> => {
  try {
    return await HostModel.query(match).exec();
  } catch (e) {
    throw e;
  }
};
