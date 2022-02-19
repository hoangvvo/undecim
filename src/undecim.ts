import { Client, request as _request } from "undici";
import { augmentError, HTTPStatusError } from "./errors.js";
import { deepMerge } from "./merge.js";
import type {
  CreateOptions,
  RequestOptions,
  Response,
  ResponsePromise,
  Undecim
} from "./types.js";

function withMethod(
  options: Omit<RequestOptions, "method"> = {},
  method: RequestOptions["method"]
): RequestOptions {
  return { ...options, method };
}

function setHeader(
  options: Omit<RequestOptions, "data">,
  key: string,
  value: string
) {
  if (!options.headers) options.headers = {};
  // @ts-ignore
  options.headers[key] = value;
}

function transformData(options: Omit<RequestOptions, "data">, data: RequestOptions["data"]): Omit<RequestOptions, "data"> {
  if (Array.isArray(options.headers))
    throw new Error("options.headers array is not supported");
  if (data && typeof data === "object") {
    if (data instanceof URLSearchParams) {
      options.body = data.toString();
      setHeader(options, "content-type", "application/x-www-form-urlencoded");
    } else if (Buffer.isBuffer(data)) {
      options.body = data;
    } else {
      options.body = JSON.stringify(data);
      setHeader(options, "content-type", "application/json");
    }
  } else {
    options.body = data;
  }
  return options;
}

export function create({ origin, ...defaults }: CreateOptions = {}): Undecim {
  let requester = _request;
  if (origin) {
    const client = new Client(origin);
    requester = (url, options) => {
      let origin: string | undefined, path: string;
      if (typeof url === "string") {
        if (url.startsWith("/")) path = url;
        else {
          const urlObj = new URL(url);
          origin = urlObj.origin;
          path = url.substring(origin.length);
        }
      } else if ("origin" in url) {
        origin = url.origin;
        path = url.href.substring(origin.length);
      } else {
        throw new Error("UrlObject is not supported"); // FIXME: UrlObject not supported
      }
      return client.request({
        origin,
        path,
        ...options,
        method: options?.method || "GET",
      });
    };
  }

  const un = function un(url, { data, ...opts } = {}) {
    const options = transformData(deepMerge(defaults, opts, false), data);

    const fn = async () => {
      // Delay the fetch so that helper methods can set the Accept header
      await Promise.resolve();

      let response: Response;
      try {
        response = (await _request(url, options)) as Response;
      } catch (err: any) {
        // undici error
        throw augmentError(err, url, undefined, options);
      }

      response.json = <T>() => response.body.json() as Promise<T>;
      response.text = () => response.body.text();
      response.blob = () => response.body.blob();
      response.arrayBuffer = () => response.body.arrayBuffer();

      if (!(response.statusCode >= 200 && response.statusCode < 300)) {
        throw new HTTPStatusError(response, url, options);
      }

      return response;
    };

    const result = fn() as ResponsePromise;

    result.json = async <T>() => {
      setHeader(options, "accept", "application/json");
      return (await result).json<T>();
    };
    result.text = async () => {
      setHeader(options, "accept", "text/*");
      return (await result).text();
    };
    result.blob = () => result.then((response) => response.blob());
    result.arrayBuffer = () =>
      result.then((response) => response.arrayBuffer());

    return result;
  } as Undecim;

  un.get = (url, options) => un(url, withMethod(options, "GET"));
  un.post = (url, options) => un(url, withMethod(options, "POST"));
  un.put = (url, options) => un(url, withMethod(options, "PUT"));
  un.delete = (url, options) => un(url, withMethod(options, "DELETE"));
  un.patch = (url, options) => un(url, withMethod(options, "PATCH"));

  return un;
}
