//TODO: re-factor
import winston                   from 'winston';

const l = function(msg) {winston.log('info', 'errorsUtils:', msg);};

export class UnauthorizedAccessError extends Error {
  constructor(code, error) {
    super(this, error);
    this.name = "UnauthorizedAccessError";
    this.message = error;
    this.code = code;
    this.status = 401;
    this.inner = error;
  }
};

export class NotFoundError extends Error {
  constructor(code, error) {
    super(this, error);
    this.name = "NotFoundError";
    this.message = error;
    this.code = code;
    this.status = 404;
    this.inner = error;
  }
};

export let errorHandler = function(err, req, res, next) {
  l(err);
  let code = 500;
  return res.status(code).json(err);

  //let errorType = typeof err;
  //let msg = { message: "Internal Server Error" };
  // switch (err.name) {
  // case "UnauthorizedError":
  //   code = err.status;
  //   msg = undefined;
  //   break;
  // case "BadRequestError":
  // case "UnauthorizedAccessError":
  // case "NotFoundError":
  //   code = err.status;
  //   msg = err.inner;
  //   break;
  // default:
  //   break;
  // }
};
