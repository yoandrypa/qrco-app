//import { isAfter, set, subDays } from "date-fns";

import * as utils from "../utils";
import { VisitModel } from "../models/link";

export const find = async (match: any) => {
  try {
    return await VisitModel.query(match).exec();
  } catch (e) {
    throw e;
  }
};