import { DomainModel } from "../models/link";

interface CreateDataType extends Partial<DomainType> {
  address: string;
}

export const create = async (params: CreateDataType) => {
  try {
    params.address = params.address.toLowerCase();

    const exists = await DomainModel.query({ address: { eq: params.address } }).using("addressIndex").exec();

    const newDomain = {
      address: params.address,
      homepage: params.homepage || undefined,
      userId: params.userId,
      banned: !!params.banned
    };

    let domain: DomainType;
    if (exists) {
      // @ts-ignore
      domain = await DomainModel.update({ userId: exists.userId, createdAt: exists.createdAt }, {
        ...newDomain
      });
    } else {
      // @ts-ignore
      domain = await DomainModel.create({ createdAt: Date.now(), ...newDomain });
    }

    return domain;
  } catch (e) {
    throw e;
  }
};

export const list = async (match: any): Promise<any> => {
  try {
    return await DomainModel.query(match).exec();
  } catch (e) {
    throw e;
  }
};

export const get = async (key: string): Promise<any> => {
  try {
    return await DomainModel.get(key);
  } catch (e) {
    throw e;
  }
};

export const find = async (params: any): Promise<any> => {
  try {
    return await DomainModel.query(params).exec();
  } catch (e) {
    throw e;
  }
};

export const remove = async (key: { userId: string, createdAt: number }) => {
  try {
    await DomainModel.delete(key);

    return true;
  } catch (e) {
    throw e;
  }
};
