import { CustomError, sanitize } from "../utils";
import * as Domain from "../queries/domain";

export const get = async (key: string) => {
  try {
    return await Domain.get(key);
  } catch (e: any) {
    throw new CustomError(e.message, 500, e);
  }
};

export const list = async (params: any) => {
  try {
    return await Domain.list({ userId: { eq: params.userId } });
  } catch (e: any) {
    throw new CustomError(e.message, 500, e);
  }
};

export const find = async (params: any) => {
  try {
    return await Domain.find({ userId: { eq: params.userId } });
  } catch (e: any) {
    throw new CustomError(e.message, 500, e);
  }
};

export const create = async (params: { body: { address?: string; userId: any; homepage?: string } }) => {
  try {
    const { address, homepage, userId } = params.body;

    const domainItem = await Domain.create({
      // @ts-ignore
      address,
      homepage,
      userId
    });

    return sanitize.domain(domainItem);
  } catch (e: any) {
    throw new CustomError(e.message, 500, e);
  }
};

export const remove = async (key: { userId: string, createdAt: number }) => {
  try {
    //TODO review this logic
    /*const domain = await query.domain.update(
      {
        id: { eq: domainId },
        userId: { eq: userId }
      },
      { userId: "" }
    );*/

    const domainItem = await Domain.remove(key);

    if (!domainItem) {
      throw new CustomError("Could not delete the domain.", 500);
    }

    return { message: "DomainModel deleted successfully" };
  } catch (e: any) {
    throw new CustomError(e.message, 500, e);
  }
};
