const _webpack = require("webpack");
const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
const srcDir = path.join(__dirname, "..", "src");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = (_env, argv) => {
  const isProduction = argv.mode === "production";

  return {
    entry: {
      background: path.join(srcDir, "background/index.ts"),
      content_script: path.join(srcDir, "script/index.ts"),
      popup: path.join(srcDir, "popup/index.tsx"),
      settings: path.join(srcDir, "settings/index.tsx"),
    },
    output: {
      path: path.join(__dirname, "../dist/js"),
      filename: "[name].js",
      clean: true,
    },
    mode: isProduction ? "production" : "development",
    devtool: isProduction ? false : "inline-source-map",

    optimization: {
      splitChunks: !isProduction
        ? false
        : {
            name: "vendor",
            chunks(chunk) {
              return chunk.name !== "background";
            },
            cacheGroups: {
              preact: {
                test: /[\\/]node_modules[\\/]preact/,
                name: "preact",
                chunks: "all",
                enforce: true,
              },
            },
          },
      minimize: isProduction,
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          exclude: /node_modules/,
          use: [
            {
              loader: "ts-loader",
              options: {
                configFile: path.resolve(__dirname, "../tsconfig.json"),
                compilerOptions: {
                  jsx: "react-jsx",
                  jsxImportSource: "preact",
                },
                transpileOnly: !isProduction,
              },
            },
          ],
        },
        {
          test: /\.css$/i,
          use: [MiniCssExtractPlugin.loader, "css-loader", "postcss-loader"],
          exclude: /node_modules/,
        },
      ],
    },
    resolve: {
      extensions: [".ts", ".tsx", ".js"],
      alias: {
        react: "preact/compat",
        "react-dom": "preact/compat",
        "react/jsx-runtime": "preact/jsx-runtime",
      },
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: "[name].css",
      }),
      new CopyPlugin({
        patterns: [{from: ".", to: "../", context: "public"}],
        options: {},
      }),
    ],
  };
};
