import Joi from "joi";

import { NextApiRequest } from "next";
import LinkModel from "../../../models/qr_link";
import { PreGeneratedModel } from "../../../models/link";

import * as linkHandler from "../../../handlers/links";

export { NotFound, respondWithException } from "../../../libs/exceptions";
export { withSessionRoute, checkAuthorization } from '../base/helpers';

/**
 * Parse and validate the request via POST
 * @param req
 */
export function parseFromPostRequest(req: NextApiRequest): any {
  // TODO: Validate Links post request data
  // const schema = Joi.object({
  //   ....
  // });
  //
  // return Joi.attempt(req.body, schema, { abortEarly: false });

  const { currentUser } = req.session;

  return { body: req.body, user: { id: currentUser.cognito_user_id } }
}

/**
 * Parse and validate the filters and pagination from request parameters
 * @param req
 */
export function parseFromListRequest(req: NextApiRequest) {
  const schema = Joi.object({
    limit: Joi.number().min(1).max(50).optional().default(10),
    pageKey: Joi.string().optional(),
  });

  return Joi.attempt(req.query, schema, { abortEarly: false });
}

export async function fetchLinks(currentUser: any, limit: number, pageKey: string) {
  return LinkModel.fetchByUser(currentUser.cognito_user_id, limit, pageKey);
}

export async function countLinks(currentUser: any) {
  return LinkModel.countByUser(currentUser.cognito_user_id);
}

export async function checkLinkStatus(code: string) {
  const message = `The code ${code} is already in use.`;

  const link = await LinkModel.query({ address: code }).count().exec();
  if (link.count !== 0) return { available: false, existsAs: 'link', message };

  const preCode = await PreGeneratedModel.query({ code }).count().exec();
  if (preCode.count !== 0) return { available: false, existsAs: 'pre-generated-code', message };

  return { available: true }
}

export async function createLink(data: any) {
  // TODO: Migrate this create method to LinkModel.
  return linkHandler.create(data);
}