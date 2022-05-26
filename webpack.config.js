const path = require("path");
module.exports = {
  devServer: {
    allowedHosts: 'all',
    static: {
      directory: path.join(__dirname, "dist"),
    },
    port: 9000,
    hot: true,
  },
  entry: {
    index: "./src/conpositor.js",
  },
  module: {
    rules: [
      { test: /\.(js)$/, use: "babel-loader", exclude: /node_modules/ },
      { test: /\.(ts)$/, use: "ts-loader", exclude: /node_modules/ },
      { test: /\.(d.ts)$/, use: "ts-loader", exclude: /node_modules/ },
    ],
  },
  resolve: {
    extensions: [".ts", ".js", ".d.ts"],
  },
  output: {
    filename: "[name]_bundle.js",
    path: __dirname + "/dist",
  },
  mode: "development",
};
