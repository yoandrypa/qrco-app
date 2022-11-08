import * as Host from "../queries/host";
import { CustomError } from "../utils";

export const find = async (match: Partial<HostQueryType>): Promise<HostType> => {
  try {
    return await Host.find(match);
  } catch (e: any) {
    throw new CustomError(e.message, 500, e);
  }
};

/*export const create = async (params: { body: { address?: string; userId: any; homepage?: string } }) => {
  const { address, homepage, userId } = params.body;

  const domainData = await domain.add({
    // @ts-ignore
    address,
    homepage,
    userId
  });

  return sanitize.domain(domainData);
};

export const list = async (params: any) => {
  return await domain.get({ userId: { eq: params.userId } });
};

export const remove = async (domainId: string, userId?: string) => {
  //TODO review this logic
  /!*const domain = await query.domain.update(
    {
      id: { eq: domainId },
      userId: { eq: userId }
    },
    { userId: "" }
  );*!/

  const data = await domain.remove({
    id: domainId,
    userId: userId
  });

  if (!data) {
    throw new CustomError("Could not delete the domain.", 500);
  }

  return { message: "Domain deleted successfully" };
};*/
