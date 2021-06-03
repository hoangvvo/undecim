import typescript from "@rollup/plugin-typescript";

export default {
  input: "src/index.ts",
  output: [
    {
      dir: "dist",
      format: "es",
      preferConst: true,
    },
    {
      file: "dist/index.cjs",
      format: "cjs",
      preferConst: true,
      strict: true,
    },
  ],
  plugins: [typescript({ declaration: false })],
  external: ["undici"],
};
