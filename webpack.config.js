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
    index: "./src/strategyResolver.js",
  },
  module: {
    rules: [
      { test: /\.(js)$/, use: "babel-loader", exclude: /node_modules/ },
    ],
  },
  resolve: {
    extensions: [".js", ".d.ts"],
  },
  output: {
    filename: "[name]_bundle.js",
    path: __dirname + "/dist",
  },
  mode: "development",
};
