import * as User from "../queries/user";
import { CustomError } from "../utils";

export const create = async (data: UserType) => {
  try {
    return await User.create(data);
  } catch (e: any) {
    throw new CustomError(e.message, 500, e);
  }
};

export const get = async (id: string) => {
  try {
    return await User.get(id);
  } catch (e: any) {
    throw new CustomError(e.message, 500, e);
  }
};

export const update = async (userData: Match<UserType>, data: Partial<UserType>) => {
  try {
    return await User.update(userData, data);
  } catch (e: any) {
    throw new CustomError(e.message, 500, e);
  }
};

export const findByCustomerId = async (customerId: string): Promise<any> => {
  try {
    return await User.findByCustomerId({ customerId: { eq: customerId } });
  } catch (e: any) {
    throw new CustomError(e.message, 500, e);
  }
};

export const deleteUserSubscription = async (customerId: Match<UserType>) => {
  try {
    return await User.deleteSubscription({ customerId: customerId });
  } catch (e: any) {
    throw new CustomError(e.message, 500, e);
  }
};
