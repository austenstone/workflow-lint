"use strict";

const path = require("path");
const webpack = require("webpack");

module.exports = (env, argv) => {
  /**@type {import('webpack').Configuration}*/

  return [{
    mode: 'development',
    entry: './src/index.ts',
    devtool: 'source-map',
    node: {
      __dirname: false // We need to support dirname to be able to load the language server
    },
    resolve: {
      extensions: ['.ts', '.js']
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: 'ts-loader',
          exclude: /node_modules/,
        },
        {
          test: /\.m?js$/,
          resolve: {
            fullySpecified: false // disable the behaviour
          }
        }
      ]
    },
    ignoreWarnings: [/Failed to parse source map/],
    target: "node",
    output: {
      path: path.resolve(__dirname, "dist"),
      filename: "index.js",
      libraryTarget: "commonjs",
      devtoolModuleFilenameTemplate: "../[resource-path]"
    }
  }];
};