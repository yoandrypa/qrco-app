import { IpModel as IpModel } from "../models/link";

export const create = async (ipToAdd: string) => {
  const ip = ipToAdd.toLowerCase();

  const currentIP = await IpModel.get(ip);

  if (!currentIP) {
    await IpModel.create({ ip });
  }

  return ip;
};
