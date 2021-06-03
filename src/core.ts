import type { IncomingHttpHeaders } from "http";
import { Dispatcher, request as _request } from "undici";
import { URLSearchParams } from "url";
import { HTTPStatusError } from "./errors.js";
import { deepMerge } from "./merge.js";
import type {
  Options,
  Response,
  ResponseData,
  ResponsePromise,
  Undecim,
} from "./types.js";

function _undiciRemap(value: Dispatcher.ResponseData): ResponseData {
  return {
    body: value.body,
    headers: value.headers,
    status: value.statusCode,
    ok: value.statusCode >= 200 && value.statusCode < 300,
  };
}

async function _text(
  response: Promise<ResponseData> | ResponseData
): Promise<string> {
  if ("then" in response) response = await response;
  let raw = "";
  for await (const data of response.body) {
    raw += data;
  }
  return raw;
}

function _json<T>(response: Promise<ResponseData> | ResponseData): Promise<T> {
  return _text(response).then(JSON.parse);
}

function _undiciOptions(options: Options) {
  const undiciOpts: Omit<Dispatcher.RequestOptions, "origin" | "path"> & {
    headers: IncomingHttpHeaders;
  } = {
    method: options.method || "GET",
    headers: options.headers || {},
    body: options.body,
  };

  if (options.data && typeof options.data === "object") {
    if (options.data instanceof URLSearchParams) {
      undiciOpts.body = options.data.toString();
      undiciOpts.headers["content-type"] = "application/x-www-form-urlencoded";
    } else if (Buffer.isBuffer(options.data)) {
      undiciOpts.body = options.data;
    } else {
      undiciOpts.body = JSON.stringify(options.data);
      undiciOpts.headers["content-type"] = "application/json";
    }
  } else {
    undiciOpts.body = options.data;
  }

  return undiciOpts;
}

function withMethod(options: Options = {}, method: Options["method"]) {
  options.method = method;
  return options;
}

export function create(defaults: Options = {}): Undecim {
  const un = function un(url, opts: Options = {}) {
    const options = deepMerge(defaults, opts, false) as Options;

    const undiciOpts = _undiciOptions(options);

    if (options.prefixURL) {
      url = url.replace(/^(?!.*\/\/)\/?(.*)$/, options.prefixURL + "/$1");
    }

    const fn = async () => {
      // Delay the fetch so that helper methods can set the Accept header
      await Promise.resolve();
      const response = (await _request(url, undiciOpts).then(
        _undiciRemap
      )) as Response;
      response.json = <T>() => _json<T>(response);
      response.text = () => _text(response);
      if (!response.ok) {
        throw new HTTPStatusError(response, options);
      }
      return response;
    };

    const result = fn() as ResponsePromise;

    result.json = <T>() => {
      undiciOpts.headers.accept =
        undiciOpts.headers.accept || "application/json";
      return _json<T>(result);
    };
    result.text = () => {
      undiciOpts.headers.accept = undiciOpts.headers.accept || "text/*";
      return _text(result);
    };

    return result;
  } as Undecim;

  un.get = (url, options) => un(url, withMethod(options, "GET"));
  un.post = (url, options) => un(url, withMethod(options, "POST"));
  un.put = (url, options) => un(url, withMethod(options, "PUT"));
  un.delete = (url, options) => un(url, withMethod(options, "DELETE"));
  un.patch = (url, options) => un(url, withMethod(options, "PATCH"));
  un.create = create;

  return un;
}
