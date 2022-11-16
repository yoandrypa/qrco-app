import { LinkModel as LinkModel } from "../models/link";
import dynamoose from "../libs/dynamoose";
// @ts-ignore
import bcrypt from "bcryptjs";
import { CustomError } from "../utils";

interface Create extends Partial<LinkType> {
  address: string | undefined;
  target: string;
}

export const create = async (params: Create) => {
  try {
    let encryptedPassword: string = "";

    if (params.password) {
      const salt = await bcrypt.genSalt(12);
      encryptedPassword = await bcrypt.hash(params.password, salt);
    }
    return await LinkModel.create({
      ...params,
      password: encryptedPassword,
      createdAt: params.createdAt ? params.createdAt : Date.now()
    });
  } catch (e) {
    throw e;
  }
};

interface GetParams {
  limit?: number;
  search?: string;
  skip?: number;
}

export const list = async (match: Partial<LinkQueryType>, params: GetParams) => {
  try {
    //TODO include the Skip param
    const query = LinkModel.query(match);

    if (params.search) {
      query.and().parenthesis(
        new dynamoose.Condition()
          .where("description")
          .contains(params.search)
          .or()
          .where("address")
          .contains(params.search)
          .or()
          .where("target")
          .contains(params.search)
      );
    }

    const results = await query.sort("descending").limit(params.limit || 10).exec();
    const links/*: LinkJoinedDomainType[]*/ = results;

    return [links, results.count];
  } catch (e) {
    throw e;
  }
};

export const find = async (match: Partial<LinkQueryType>): Promise<any> => {
  try {
    const resp = await LinkModel.query(match).exec();
    return resp;
  } catch (e) {
    throw e;
  }
};

export const findByAddress = async (match: Partial<LinkQueryType>): Promise<any> => {
  try {
    const resp = await LinkModel.query(match).using("addressIndex").exec();
    return resp;
  } catch (e: any) {
    throw e;
  }
};

interface TotalParams {
  search?: string;
}

export const total = async (
  match: Match<LinkQueryType>,
  params: TotalParams = {}
) => {
  try {
    const query = LinkModel.query(match);

    if (params.search) {
      query.and().parenthesis(
        new dynamoose.Condition()
          .where("description")
          .contains(params.search)
          .or()
          .where("address")
          .contains(params.search)
          .or()
          .where("target")
          .contains(params.search)
      );
    }

    const result = await query.count().exec();

    return typeof result.count === "number"
      ? result.count
      : parseInt(result.count);
  } catch (e) {
    throw e;
  }
};

export const update = async (key: { userId: string, createdAt: number } | Partial<LinkType>, update: Partial<LinkType>
) => {
  try {
    // @ts-ignore
    return await LinkModel.update(key, { ...update });
  } catch (e) {
    throw e;
  }
};

export const remove = async (key: { userId: string, createdAt: number }) => { //DONE
  try {
    await LinkModel.delete(key);
    return true;
  } catch (e) {
    throw e;
  }
};
