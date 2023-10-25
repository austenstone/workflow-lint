"use strict";

const path = require("path");
const webpack = require("webpack");

module.exports = (env, argv) => {
  /**@type {import('webpack').Configuration}*/
  const config = {
    entry: "./src/index.ts", // the entry point of this extension, 📖 -> https://webpack.js.org/configuration/entry-context/
    devtool: "source-map",
    externals: {
      vscode: "commonjs vscode"
    },
    node: {
      __dirname: false // We need to support dirname to be able to load the language server
    },
    plugins: [
      new webpack.ProvidePlugin({
        Buffer: ["buffer", "Buffer"]
      }),
      new webpack.DefinePlugin({
        PRODUCTION: argv.mode === "production"
      })
    ],
    resolve: {
      extensions: [".ts", ".js"],
      alias: {
        "universal-user-agent$": "universal-user-agent/dist-node/index.js"
      }
    },
    module: {
      rules: [
        {
          test: /\.ts$/,
          exclude: /node_modules/,
          use: [
            {
              loader: "ts-loader",
              options: {
                compilerOptions: {
                  sourceMap: true
                }
              }
            }
          ]
        },
        {
          test: /\.m?js$/,
          resolve: {
            fullySpecified: false // disable the behaviour
          }
        },
        {
          test: /\.node$/,
          use: "node-loader"
        }
      ]
    },
    ignoreWarnings: [/Failed to parse source map/]
  };

  const nodeConfig = {
    ...config,
    mode: 'production',
    target: "node",
    output: {
      path: path.resolve(__dirname, "dist"),
      filename: "index.js",
      libraryTarget: "commonjs",
      devtoolModuleFilenameTemplate: "../[resource-path]"
    }
  };

  return [nodeConfig];
};