import { UserModel } from "../models/link";
import dynamoose from "../libs/gateways/dynamodb/dynamoose";

export const find = async (match: any) => {
  try {
    return await UserModel.get(match);
  } catch (e) {
    throw e;
  }
};
export const findByCustomerId = async (match: Partial<UserQueryType>) => {
  try {
    return await UserModel.query(match).using("customerIdIndex").exec();
  } catch (e) {
    throw e;
  }
};

export const deleteSubscription = async (match: Partial<UserQueryType>) => {
  return await UserModel.update(match, { "$REMOVE": "subscriptionData" });
};

interface CreateData {
  id: string;
}

export const create = async (params: CreateData) => {
  try {
    const data = {
      id: params.id
    };

    return await UserModel.create(data);
  } catch (e) {
    throw e;
  }
};

export const get = async (key: any) => {
  try {
    return await UserModel.get(key);
  } catch (e) {
    throw e;
  }
};

export const update = async (match: Match<UserType>, update: Partial<UserType>) => {
  let condition = new dynamoose.Condition();
  Object.entries(match).forEach(([key, value], index) => {
    if (index === 0) {
      condition = condition.where(key).eq(value);
    } else {
      condition = condition
        .and()
        .where(key)
        .eq(value);
    }
  });

  return await UserModel.update(
    // @ts-ignore
    match.id,
    {
      ...update
    },
    { condition }
  );
};
