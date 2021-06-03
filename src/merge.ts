/* eslint-disable @typescript-eslint/ban-ts-comment */
export function deepMerge<X, Y>(opts: X, overrides: Y, lowerCase: boolean) {
  const out = {} as X & Y;
  if (Array.isArray(opts)) {
    return opts.concat(overrides);
  }
  for (const i in opts) {
    const key = lowerCase ? i.toLowerCase() : i;
    // @ts-ignore
    out[key] = opts[i];
  }
  for (const i in overrides) {
    const key = lowerCase ? i.toLowerCase() : i;
    const value = overrides[i];
    out[key as keyof typeof out] = // @ts-ignore
      key in out && typeof value == "object" // @ts-ignore
        ? deepMerge(out[key], value, key === "headers")
        : value;
  }
  return out;
}
