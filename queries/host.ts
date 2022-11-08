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

export const add = async (params: Add) => {
  params.address = params.address.toLowerCase();

  const exists = await HostModel.findOne({
    address: { eq: params.address }
  });

  const newHost = {
    address: params.address,
    banned: !!params.banned
  };

  let host: HostType;
  if (exists) {
    // @ts-ignore
    host = await HostModel.update(exists.id, {
      ...newHost
    });
  } else {
    // @ts-ignore
    host = await HostModel.create(newHost);
  }

  //redis.remove.host(host);

  return host;
};
