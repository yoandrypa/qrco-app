import { Request } from "express";

export interface CreateLinkReq extends Request {
  body: {
    reuse?: boolean;
    password?: string;
    customurl?: string;
    description?: string;
    expire_in?: number;
    domain?: Domain;
    target: string;
  };
}
