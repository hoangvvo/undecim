import type { Blob } from "buffer";
import type { Dispatcher } from "undici";

export interface BodyMixins {
  json<T = any>(): Promise<T>;
  text(): Promise<string>;
  blob(): Promise<Blob>;
  arrayBuffer(): Promise<ArrayBuffer>;
}

export type Response = Dispatcher.ResponseData & BodyMixins;

export type ResponsePromise = BodyMixins & Promise<Response>;

export type CreateOptions = {
  origin?: string | URL;
} & RequestOptions;

// RequestOptions for undici
export type RequestOptions = Omit<
  Dispatcher.RequestOptions,
  "origin" | "path" | "method"
> &
  Partial<Pick<Dispatcher.RequestOptions, "method">> & {
    data?: string | Buffer | URLSearchParams | Record<string, unknown>;
  };

export type RequestURL = string | URL;

export interface Undecim {
  (url: RequestURL, options?: RequestOptions): ResponsePromise;
  get(url: RequestURL, options?: Omit<RequestOptions, "method">): ResponsePromise;
  post(url: RequestURL, options?: Omit<RequestOptions, "method">): ResponsePromise;
  put(url: RequestURL, options?: Omit<RequestOptions, "method">): ResponsePromise;
  delete(
    url: RequestURL,
    options?: Omit<RequestOptions, "method">
  ): ResponsePromise;
  patch(url: RequestURL, options?: Omit<RequestOptions, "method">): ResponsePromise;
}
