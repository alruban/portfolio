"use strict";

const { merge } = require("webpack-merge");
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'development',
  stats: {
    all: false,
    errors: true,
    loggingDebug: ["postcss-loader"],
  }
});