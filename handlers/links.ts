import * as utils from "../utils";
import * as validators from "./validators";
import * as Link from "../queries/link";
import * as Ip from "../queries/ip";
import URL from "url";
import { CreateLinkData, UpdateLinkData } from "./types";
import { CustomError } from "../utils";
import * as DomainHandler from "./domains";

interface Query {
  userId: string;
  link?: any;
  limit?: any;
  skip?: any;
  search?: any;
  all?: any;
}

export const create = async (data: CreateLinkData) => {
  try {
    const {
      reuse,
      password,
      customUrl,
      description,
      target,
      domain,
      expireIn,
      type,
    } = data.body;
    const domainId = domain ? {
      userId: domain.userId,
      createdAt: domain.createdAt,
    } : null;

    // @ts-ignore
    const targetDomain = utils.removeWww(URL.parse(target).hostname);

    const queriesBatch = await Promise.all([
      validators.coolDown(data.user),
      validators.malware(data.user, target),
      validators.linksCount(data.user),
      reuse &&
      Link.find({
        target: { eq: target },
        userId: { eq: data.user.id },
        domainId: { eq: domainId },
      }),
      customUrl &&
      Link.findByAddress({
        address: { eq: customUrl },
        domainId: { eq: domainId },
      }),
      !customUrl && utils.generateId(domainId),
      validators.bannedDomain(data.user.id, targetDomain),
      validators.bannedHost(data.user.id, targetDomain),
    ]);

    // if "reuse" is true, try to return
    // the existent URL without creating one
    if (queriesBatch[3].length) {
      return utils.sanitize.link(queriesBatch[3][0]);
    }

    // Check if custom link already exists
    if (queriesBatch[4].length) {
      throw new CustomError("Custom URL is already in use.");
    }

    // Create new link
    const address = customUrl || queriesBatch[5];
    const params: any = {
      password,
      //@ts-ignore
      address,
      description,
      target,
      expireIn,
      type,
      userId: data.user.id,
    };
    if (domainId) {
      params.domainId = domainId;
    }
    const linkItem = await Link.create(params);

    if (!data.user && process.env.NON_USER_COOLDOWN && data.realIP) {
      await Ip.create(data.realIP);
    }

    // @ts-ignore
    return utils.sanitize.link({ ...linkItem, domain: domain?.address });
  } catch (e: any) {
    throw new CustomError(e.message, 500, e);
  }
};

export const list = async (query: Query) => {
  try {
    const { limit, skip, search, all, userId } = query;

    const match = {
      ...(!all && { userId: { eq: userId } }),
    };

    // @ts-ignore
    const [links, total]: [any[], number] = await Link.list(match,
      { limit, search, skip });

    const data = await Promise.all(
      links.map(async (link: LinkJoinedDomainType) => {
        if (link.domainId) {
          const domain = (await DomainHandler.find({ userId }))[0];
          link.domain = domain?.address;
        }
        return utils.sanitize.link(link);
      }));

    return {
      total,
      limit,
      skip,
      data,
    };
  } catch (e: any) {
    throw new CustomError(e.message, 500, e);
  }
};

export const get = async (key: { userId: string, createdAt: number }) => {
  try {
    return await Link.get(key);
  } catch (e: any) {
    throw new CustomError(e.message, 500, e);
  }
  /*if (!linkItem) {
    return;
  }
  return utils.sanitize.link(linkItem);*/
};

export const find = async (linkId: string) => {
  return await Link.find({ id: { eq: linkId } });
};

export const findByAddress = async (match: Partial<LinkQueryType>) => {
  try {
    return await Link.findByAddress(match);
  } catch (e: any) {
    throw new CustomError(e.message, 500, e);
  }
};

export const edit = async (data: UpdateLinkData) => {
  try {
    const { id, address, target, description, expireIn } = data.body;

    if (!address && !target) {
      throw new CustomError("Should at least update one field.");
    }

    const linkData = await Link.find({
      id: { eq: id },
      userId: { eq: data.user.id },
    });

    if (!linkData) {
      throw new CustomError("LinkModel was not found.");
    }

    // @ts-ignore
    const targetDomain = utils.removeWww(URL.parse(target).hostname);
    const domainId = linkData.domainId || null;

    const queriesBatch = await Promise.all([
      validators.coolDown(data.user),
      // @ts-ignore
      validators.malware(data.user, target),
      address !== linkData.address &&
      Link.find({
        address: { eq: address },
        domainId: { eq: domainId },
      }),
      validators.bannedDomain(data.user.id, targetDomain),
      validators.bannedHost(data.user.id, targetDomain),
    ]);

    // Check if custom link already exists
    if (queriesBatch[2]) {
      throw new CustomError("Custom URL is already in use.");
    }

    // Update link
    const updatedLink = await Link.update(
      {
        userId: linkData.user.id,
        createdAt: linkData.createdAt,
      },
      {
        ...(address && { address }),
        ...(description && { description }),
        ...(target && { target }),
        ...(expireIn && { expireIn }),
      },
    );

    // @ts-ignore
    return utils.sanitize.link({ ...linkData, ...updatedLink });
  } catch (e: any) {
    throw new CustomError(e.message, 500, e);
  }
};

export const remove = async (match: { userId: string, createdAt: number }) => {
  try {
    if (typeof match["createdAt"] !== "number") {
      match["createdAt"] = (new Date(match["createdAt"])).getTime();
    }
    const linkData = await Link.remove(match);

    if (!linkData) {
      throw new CustomError("Could not delete the link");
    }

    return { message: "LinkModel has been deleted successfully." };
  } catch (e: any) {
    throw new CustomError(e.message, 500, e);
  }
};
