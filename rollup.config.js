export default [
  {
    input: "./src/index.js",
    output: [
      {
        file: "dist/bundle-cjs.js",
        format: "cjs",
      },
      {
        file: "dist/bundle-es.js",
        format: "es",
      },
    ],
  },
];
