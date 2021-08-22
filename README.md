# undecim

Elegant APIs for [undici](https://github.com/nodejs/undici).

_Not ready for production_

## Feature

- Method shortcuts (`.post()`, `.get()`)
- Body method helpers (`.json()`, `.text()`)
- Throw error if status code is not ok (>= 200 and < 300)
- Parse outgoing body and set `content-type` header.
- Instances with custom defaults

## Installation

```bash
npm i undecim
```

## Usage

```js
import un from "undecim";
// CommonJS: const un = require("undecim").default;

// Set Accept header and get response as JSON shortcut
const json = await un
  .post("https://example.com", { data: { foo: "bar" } })
  .json();

// Set Accept header and get response as text shortcut
const text = await un
  .post("https://example.com", { data: { foo: "bar" } })
  .text();

// Retrieve response as it is
const response = await un.post("https://example.com", { body: { foo: "bar" } });
console.log(response.body); // body is of type Readable
console.log(response.headers);
console.log(response.status);

// and read body afterward
await response.text();
await response.json();
```

## APIs

### un(url[, options])

Make a HTTP request to `url` with an optional `options`.

### un.<method>(url[, options])

There are methods provided as shortcuts to set HTTP methods.

- **un.get(url[, options])**
- **un.post(url[, options])**
- **un.put(url[, options])**
- **un.delete(url[, options])**
- **un.patch(url[, options])**

### un.create(defaults)

Create a new instance with specific `defaults`. These `default` will be merged into each of its requests' `options`.

### options

#### options.method

Set the HTTP method for the request.

#### options.headers

Set HTTP headers for the request

#### options.data

Set the approriate body for the request based on data. In some cases, [content-type](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Type) will be set automatically if not provided.

This can be one of the following:

- `string`
- [`URLSearchParams`](https://nodejs.org/api/url.html#url_class_urlsearchparams). Content Type will be `application/x-www-form-urlencoded`.
- `Buffer`
- other `object`. Content Type will be `application/x-www-form-urlencoded`.

#### options.body

The body of the request to send as it. Use instead of `options.data` if you prefer not to have the data serialized and headers set automatically.

#### options.prefixURL

A prefix URL to append before the request url.

```
un("/user", { prefixURL: "https://example.com/v1" });
// GET https://example.com/v1/user
```

## License

[MIT](LICENSE)
