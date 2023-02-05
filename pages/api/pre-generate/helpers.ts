import dynamoose from "../../../libs/dynamoose";
import { customAlphabet } from "nanoid";
import { LinkModel, PreGeneratedModel } from "../../../models/link";

const MICRO_SITES_ROUTE = process.env.REACT_MICROSITES_ROUTE || 'https://dev.a-qr.link';
const LINK_CODE_ALPHABET = process.env.LINK_CODE_ALPHABET || 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
const MAX_ALLOW_COLLISIONS = parseInt(process.env.MAX_ALLOW_COLLISIONS || '25', 10);

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
export async function geneNewCodes(size: number, count: number, owner: string = 'any') {
  owner ||= 'any';

  const nanoId = customAlphabet(LINK_CODE_ALPHABET, size);
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

  return { codes, collisions };
}

/**
 * Returns the list of codes pre-generated available to be claimed.
 * @param owner
 */
export async function getPreGenCodes(owner: string = 'any') {
  owner ||= 'any';

  const codes = await PreGeneratedModel.query({ owner }).exec();

  return codes.map((item) => ({ ...item, url: `${MICRO_SITES_ROUTE}/${item.code}` }));
}