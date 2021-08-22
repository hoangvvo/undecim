// Adapted from https://github.com/developit/redaxios/blob/master/src/index.js#L123
export function deepMerge<X extends Record<string,any>, Y extends Record<string,any>>(opts: X, overrides: Y, lowerCase: boolean) {
  const out: any = {};
  if (Array.isArray(opts)) {
    return opts.concat(overrides);
  }
  for (const i in opts) {
    const key = lowerCase ? i.toLowerCase() : i;
    out[key] = opts[i];
  }
  for (const i in overrides) {
    const key = lowerCase ? i.toLowerCase() : i;
    const value = overrides[i];
    out[key] = 
      key in out && typeof value == "object"
        ? deepMerge(out[key], value, key === "headers")
        : value;
  }
  return out;
}
