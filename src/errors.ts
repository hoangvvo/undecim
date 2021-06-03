import { Options, Response } from "./types.js";

export class UndecimError extends Error {
  name = "UndecimError";
  code = "UN_ERR";
  constructor(message: string) {
    super(message);
  }
}

export class HTTPStatusError extends UndecimError {
  name = "HTTPStatusError";
  code = "UN_ERR_HTTP_STATUS";
  constructor(public response: Response, public options: Options) {
    super("HTTP response contains a non successful status");
  }
}
