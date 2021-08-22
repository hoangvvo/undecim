import { errors } from "undici";
import type { Options, Response } from "./types.js";

export class UndecimError extends errors.UndiciError {
  constructor(
    message: string,
    public response: Response,
    public options: Options
  ) {
    super(message);
  }
}

export class HTTPStatusError extends UndecimError {
  name = "HTTPStatusError";
  code = "UND_ERR_HTTP_STATUS";
  constructor(response: Response, options: Options) {
    super(
      `Request failed with status code ${response.status}`,
      response,
      options
    );
  }
}
