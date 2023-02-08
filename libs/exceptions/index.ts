/* eslint max-classes-per-file: ['off'] */

import { NextApiResponse } from "next";

const Joi = require('joi');

export class StandardError extends Error {
  private code: number;

  constructor(message: any, code = 0) {
    super(message);
    // Ensure the name of this error is the same as the class name
    this.name = this.constructor.name;
    this.code = code;
    // This clips the constructor invocation from the stack trace.
    // It's not absolutely essential, but it does make the stack trace a little nicer.
    //  @see Node.js reference (bottom)
    Error.captureStackTrace(this, this.constructor);
  }
}

export class NotFound extends StandardError {
  constructor(message = '') {
    super(message || 'Resource not found', 404);
  }
}

export class BatRequest extends StandardError {
  constructor(message = '') {
    super(message || 'Bad request', 400);
  }
}

export const respondWithException = (response: NextApiResponse, ex: any) => {
  let message;
  let code;

  if (Joi.isError(ex)) {
    message = Joi.isError(ex) ? ex.details.map((detail: any) => detail.message.replace(/"/g, "'")) : ex.message;
    code = 400;
  } else if (typeof ex.type === 'string' && ex.type.match(/^Stripe/)) {
    message = ex.message;
    code = ex.statusCode || 400;
  } else {
    message = ex.message || ex;
    code = ex.code || 500;
  }

  code = parseInt(code, 10) || 500;

  console.error(message);
  if (ex.stack) console.error(ex.stack);

  response.status(code).json({ success: false, message });
};
