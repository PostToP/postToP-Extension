const webpack = require("webpack");
const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
const srcDir = path.join(__dirname, "..", "src");

module.exports = {
  entry: {
    background: path.join(srcDir, "background/index.ts"),
    content_script: path.join(srcDir, "script/index.ts"),
    popup: path.join(srcDir, "popup/index.ts"),
  },
  output: {
    path: path.join(__dirname, "../dist/js"),
    filename: "[name].js",
  },

  optimization: {
    splitChunks: {
      name: "vendor",
      chunks(chunk) {
        return chunk.name !== "background";
      },
    },
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        include: path.resolve(__dirname, '../src/background'),
        use: {
          loader: "ts-loader",
          options: {
            configFile: path.resolve(__dirname, '../src/background/tsconfig.json')
          }
        }
      },
      {
        test: /\.tsx?$/,
        include: path.resolve(__dirname, '../src/popup'),
        use: {
          loader: "ts-loader",
          options: {
            configFile: path.resolve(__dirname, '../src/popup/tsconfig.json')
          }
        }
      },
      {
        test: /\.tsx?$/,
        include: path.resolve(__dirname, '../src/script'),
        use: {
          loader: "ts-loader",
          options: {
            configFile: path.resolve(__dirname, '../src/script/tsconfig.json')
          }
        }
      },
      {
        test: /\.tsx?$/,
        include: path.resolve(__dirname, '../src/common'),
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
  },
  plugins: [
    new CopyPlugin({
      patterns: [{ from: ".", to: "../", context: "public" }],
      options: {},
    }),
  ],
};
