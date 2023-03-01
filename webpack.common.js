const path = require('path');
const glob = require("glob");
const webpack = require('webpack');

const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const htmlPlugin = require("html-webpack-plugin");

const core = {
  cache: {
    buildDependencies: {
      config: [__filename],
      browserList: [path.join(__dirname, ".browserslistrc")],
    },
    type: "filesystem",
    version: "1",
  },
  entry: glob.sync("./_src/assets/**/*.*", {
    ignore: ["./_src/assets/**/_*.pcss", "./_src/assets/**/_*.js"],
  }),
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
  devtool: "source-map",
  resolve: {
    extensions: ['*', '.js', '.ts', '.tsx'],
    alias: {
      "@": path.resolve(__dirname, "./src/js"),
    },
    fallback: {
      "stream": require.resolve("stream-browserify"),
      "assert": require.resolve("assert"),
      "http": require.resolve("stream-http"),
      "https": require.resolve("https-browserify"),
      "os": require.resolve("os-browserify"),
      "url": require.resolve("url")
    }
  },
  entry: './src/index.tsx',
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

module.exports = core;