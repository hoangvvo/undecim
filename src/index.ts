import { create } from "./undecim.js";

const un = create();
export { HTTPStatusError, UndecimError } from "./errors.js";
export type {
  CreateOptions,
  RequestOptions,
  Response,
  ResponsePromise,
  Undecim,
} from "./types.js";
export { create };
export default un;
