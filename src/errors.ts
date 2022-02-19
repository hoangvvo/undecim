import { errors } from "undici";
import type { RequestOptions, RequestURL, Response } from "./types.js";

export function augmentError(
  error: errors.UndiciError,
  url: RequestURL,
  response: Response | undefined,
  options: RequestOptions
): UndecimError {
  Object.defineProperties(error, {
    response: {
      value: response,
    },
    options: {
      value: options,
      enumerable: true,
    },
  });
  return error as UndecimError;
}

export class UndecimError extends errors.UndiciError {
  response?: Response;
  constructor(message: string, response: Response, public url: RequestURL, public options: RequestOptions) {
    super(message);
    Object.defineProperty(this, "response", { value: response });
  }
}

export class HTTPStatusError extends UndecimError {
  name = "HTTPStatusError";
  code = "UND_ERR_HTTP_STATUS";
  constructor(response: Response, url: RequestURL, options: RequestOptions) {
    super(
      `Request failed with status code ${response.statusCode}`,
      response,
      url,
      options
    );
  }
}
