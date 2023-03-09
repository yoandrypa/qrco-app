import Joi from "joi";
import dynamoose from "../../../libs/dynamoose";

import { customAlphabet } from "nanoid";
import { LinkModel, PreGeneratedModel } from "../../../models/link";
import { NextApiRequest } from "next";

export { respondWithException } from "../../../libs/exceptions";

const MICRO_SITES_BASE_URL = process.env.MICRO_SITES_BASE_URL || 'https://dev.a-qr.link';
const LINK_CODE_ALPHABET = process.env.LINK_CODE_ALPHABET || 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
const MAX_ALLOW_COLLISIONS = parseInt(process.env.MAX_ALLOW_COLLISIONS || '25', 10);

/**
 * Parse and validate the request via POST
 * @param req
 */
export function parseFromPostRequest(req: NextApiRequest) {
  const schema = Joi.object({
    size: Joi.number().min(4).max(32),
    count: Joi.number().min(1).max(50),
    owner: Joi.string().optional(),
    alphabet: Joi.string().optional(),
  });

  return Joi.attempt(req.body, schema, { abortEarly: false });
}

/**
 * Parse and validate the request via PUT
 * @param req
 */
export function parseFromPutsRequest(req: NextApiRequest) {
  const schema = Joi.object({
    codes: Joi.array().items(Joi.string()).min(1),
    owner: Joi.string().optional(),
  });

  return Joi.attempt(req.body, schema, { abortEarly: false });
}

/**
 * Return true if the code already exists as qr-link or qr-pre-generated item.
 * @param code
 */
async function exists(code: string) {
  let result;

  result = await LinkModel.scan({ address: code }).count().exec();
  if (result.count === 0) result = await PreGeneratedModel.scan({ code: code }).count().exec();

  return result.count !== 0;
}

/**
 * Generate new codes available to be claimed.
 * @param size
 * @param count
 * @param owner
 */
export async function genNewCodes(size: number, count: number, owner: string = 'any', alphabet?: string) {
  const nanoId = customAlphabet(alphabet || LINK_CODE_ALPHABET, size);
  const transactions = [];
  const maxAllowCollisions = MAX_ALLOW_COLLISIONS * 100 / count;

  let collisions = 0;

  while (count !== 0) {
    const code = nanoId();
    const alreadyExists = await exists(code);

    if (!alreadyExists) {
      transactions.push(PreGeneratedModel.transaction.create({ code, owner }));
      count--;
    } else {
      collisions++;
      if (collisions > maxAllowCollisions) {
        throw new Error(`The maximum number of collisions allowed (${MAX_ALLOW_COLLISIONS}%) has been exceeded, please try another value in the size parameter.`);
      }
    }
  }

  await dynamoose.transaction(transactions);

  const codes = await getPreGenCodes(owner);

  return { ...codes, collisions };
}

/**
 * Load new codes available to be claimed.
 * @param codes
 * @param owner
 */
export async function loadNewCodes(items: string[], owner: string = 'any') {
  const transactions = [];

  let collisions = 0;

  for (const code of items) {
    const alreadyExists = await exists(code);

    if (!alreadyExists) {
      transactions.push(PreGeneratedModel.transaction.create({ code, owner }));
    } else {
      collisions++;
    }
  }

  if (transactions.length > 0) await dynamoose.transaction(transactions);

  const codes = await getPreGenCodes(owner);

  return { ...codes, collisions };
}

/**
 * Returns the list of codes pre-generated available to be claimed.
 * @param owner
 */
export async function getPreGenCodes(owner: string = 'any') {
  const codes: any[] = await PreGeneratedModel.query({ owner }).exec();

  return {
    codes: codes.map((item) => ({ ...item, url: `${MICRO_SITES_BASE_URL}/${item.code}` })),
    count: codes.length,
  };
}

/**
 * Delete all codes pre-generated of the a owner.
 * @param owner
 */
export async function delPreGenCodes(owner: string) {
  const codes: any[] = await PreGeneratedModel.query({ owner }).exec();

  codes.forEach(({ code }) => {
    PreGeneratedModel.delete({ code }).then((r) => {
      console.log(r);
    })
  });

  return codes;
}