# undecim

Elegant APIs for [undici](https://github.com/nodejs/undici).

_Not ready for production_

```sh
npm i undici undecim
```

## Feature

- Method shortcuts (`.post()`, `.get()`, etc.)
- Body mixins helpers like `fetch` (`.json()`, `.text()`) before response
- Throw error if status code is not ok (>= 200 and < 300)
- Parse outgoing body (`options.data`) and set `content-type` header.
- Instances with custom defaults

## Installation

```bash
npm i undecim
```

## Usage

```js
import un, { create } from "undecim";
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
const response = await un.post("https://example.com", { data: { foo: "bar" } });
console.log(response.body); // body is of type Readable & BodyMixin
console.log(response.headers);
console.log(response.statusCode);
// body mixins also available here
await response.text();
await response.json();

// Create a new instance of undecim
const un = create(options);
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

### options

The same with [`options` in `undici.request`](https://undici.nodejs.org/#/?id=undicirequesturl-options-promise) with following additions.

#### options.data

Set the approriate body for the request based on data. In some cases, [content-type](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Type) will be set automatically if not provided.

This can be one of the following:

- `string`
- [`URLSearchParams`](https://nodejs.org/api/url.html#url_class_urlsearchparams). Content Type will be `application/x-www-form-urlencoded`.
- `Buffer`
- other `object`. Content Type will be `application/x-www-form-urlencoded`.

### create(defaults)

Create a new instance with specific `defaults`. These `default` will be merged into each of its requests' `options`.

If `default.origin` is defined, a [Client](https://undici.nodejs.org/#/docs/api/Client) is created. Requests made then should match the origin.

## Error handling

Only difference in `undecim` is that it also throws `HTTPStatusError` when status code is not >= 200 and < 300.

Errors thrown by `undici` is also augmented with additional properties:

- `response` (non-enumerable) the original response object (including body mixins). **Only available if there is no `undici` error.**
- `options`: the request options
- `url`: the request URL

```js
import { UndecimError } from "undecim";

try {
  const response = await un("https://example.com");
  // or
  const response = await un("https://example.com").json();
} catch (err) {
  if (err instanceof UndecimError) {
    console.log(err.options);
    console.log(err.url);
    // Not always available
    if (err.response) {
      console.log(err.response.statusCode);
      console.log(err.response.headers);
      console.log(await err.response.text());
    }
  } else {
    // some other handling
  }
}
```

## License

[MIT](LICENSE)
