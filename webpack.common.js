"use strict";

const path = require('path');
const webpack = require('webpack');

const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const htmlPlugin = require("html-webpack-plugin");

module.exports = {
  entry: {
    main: ['./src/index.tsx', './src/css/main.pcss']
  },
  module: {
    rules: [
      {
        test: /\.(s[ac]|c|pc)ss$/i,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              esModule: false,
              publicPath: "",
            },
          },
          "css-loader",
          "postcss-loader"
        ],
      },
      {
        test: /\.([tj]sx?)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        },
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
        generator: {
          filename: '[name][ext]'
        }
      },
      {
        test: /\.(png|jpg|jpeg|gif|ico|webp)$/i,
        type: 'asset/resource',
        generator: {
          filename: '[name][ext]'
        }
      },
      {
        test: /\.svg$/i,
        issuer: /\.[jt]sx?$/,
        use: '@svgr/webpack',
        generator: {
          filename: '[name][ext]'
        }
      },
      {
        test: /\.(json)$/i,
        type: 'asset/resource',
        generator: {
          filename: '[name][ext]'
        }
      },
      {
        test: /\.(xml)$/i,
        type: 'asset/resource',
        generator: {
          filename: '[name][ext]'
        }
      },
      {
        test: /\.webmanifest$/i,
        use: 'webpack-webmanifest-loader',
        type: 'asset/resource',
      },
    ],
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new MiniCssExtractPlugin(),
    new htmlPlugin({
      template: "./src/index.html",
    }),
    new webpack.ProvidePlugin({
      process: 'process/browser',
      Buffer: ['buffer', 'Buffer']
    })
  ],
  resolve: {
    extensions: ['*', '.js', '.jsx', '.ts', '.tsx'],
    alias: {
      "@": path.resolve(__dirname, "./src/js"),
    }
  },
  optimization: {
    moduleIds: "deterministic",
    splitChunks: {
      chunks: "all",
      automaticNameDelimiter: ".",
      minChunks: 2,
      cacheGroups: {
        vendors: false,
        framework: {
          test: /(?<!node_modules.)[\\\/]node_modules[\\\/](react|react-dom|scheduler)[\\\/]/,
          name: "framework",
          chunks: "all",
          priority: 40,
          enforce: true,
        },
        lib: {
          test: /[\\\/]node_modules[\\\/]/,
          name: "lib",
          chunks: "all",
        },
      },
    },
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist')
  },
  devServer: {
    static: path.resolve(__dirname, './dist'),
  },
};
