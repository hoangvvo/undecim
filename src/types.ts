import type { IncomingHttpHeaders } from "http";
import type { Readable } from "stream";
import type { Dispatcher } from "undici";
import type { URLSearchParams } from "url";

export interface BodyMethods {
  json<T>(): Promise<T>;
  text(): Promise<string>;
}

export interface ResponseData {
  status: number;
  headers: IncomingHttpHeaders;
  body: Readable;
  ok: boolean;
}
export type ResponsePromise = BodyMethods & Promise<Response>;
export type Response = BodyMethods & ResponseData;

export interface Options {
  headers?: IncomingHttpHeaders;
  data?: string | Buffer | URLSearchParams | Record<string, unknown>;
  body?: Dispatcher.DispatchOptions["body"];
  method?: Dispatcher.HttpMethod;
  prefixURL?: string;
}

export interface Undecim {
  (url: string, options?: Options): ResponsePromise;
  get(url: string, options?: Options): ResponsePromise;
  post(url: string, options?: Options): ResponsePromise;
  put(url: string, options?: Options): ResponsePromise;
  delete(url: string, options?: Options): ResponsePromise;
  patch(url: string, options?: Options): ResponsePromise;
  create(defaults?: Options): Undecim;
}
