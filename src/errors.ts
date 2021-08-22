import { errors } from "undici";
import { Options, Response } from "./types.js";

export class HTTPStatusError extends errors.UndiciError {
  name = "HTTPStatusError";
  code = "UND_ERR_HTTP_STATUS";
  constructor(public response: Response, public options: Options) {
    super(`Request failed with status code ${response.status}`);
  }
}
