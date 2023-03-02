import dynamoose from "../../libs/dynamoose";
import schema from "./link";
import { ModelType, ObjectType } from "dynamoose/dist/General";
import { Item } from "dynamoose/dist/Item";

interface ILink extends Item {
  countByUser: (userId: string) => number;
  fetchByUser: (userId: string, limit?: number, pageKey?: string) => number;
}

export const Link: ModelType<ILink> = dynamoose.model<ILink>("links", schema);

Link.methods.set("countByUser", async function (userId: string) {
  const response = await this.query({ userId }).count().exec();

  return response;
});

Link.methods.set("fetchByUser", async function (userId: string, limit: number = 10, pageKey?: string) {
  const query = this.query({ userId }).limit(limit);

  if (pageKey) {
    const key: ObjectType = JSON.parse(Buffer.from(pageKey, 'base64').toString('utf8'));
    query.startAt(key);
  }

  const { count } = await this.query({ userId }).count().exec();
  const response = await query.exec();

  return {
    items: response,
    nextPageKey: Buffer.from(JSON.stringify(pageKey), 'utf8').toString('base64'),
    count,
  };
});

export default Link;