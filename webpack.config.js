const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const glob = require('glob');

const NODE_ENV = process.env.NODE_ENV || 'development';
const IS_DEV = NODE_ENV === 'development';
const IS_PROD = NODE_ENV === 'production';

const config = require("./config.json");

const extractLESS = new ExtractTextPlugin({
        filename: '[name].css',
        disable: false,
        allChunks: true
    }
);
const paths = {
    DIST: path.resolve(__dirname, 'dist/assets'),
    SRC: path.resolve(__dirname, 'src/client'),
    ASSETS: path.resolve(__dirname, 'src/client/assets'),
};

module.exports = {
    entry: [
        ... IS_DEV ? ['react-hot-loader/patch'] : [],
        path.join(paths.SRC, 'client.js'),
    ],
    output: {
        path: paths.DIST,
        filename: 'client.js',
    },
    plugins: [
        ... IS_DEV ? [
            new webpack.NamedModulesPlugin(),
            new webpack.HotModuleReplacementPlugin(),
        ] : [],

        new HtmlWebpackPlugin({
            template: path.join(paths.SRC, 'index.html'),
        }),

        extractLESS,

        new CopyWebpackPlugin([
            { from: paths.ASSETS },
        ]),
    ],
    module: {
        loaders: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules\/(?!(semantic-ui-react)\/).*/,
                use: [
                    'babel-loader',
                ],
            }, {
                test: /\.less/,
                loader: ExtractTextPlugin.extract(['css-loader', 'less-loader'])
            }
        ]
    },
    resolve: {
        extensions: ['.js', '.jsx']
    },
    devServer: {
        port: config.client.port,
        host: config.client.host,
        hot: IS_DEV,
        proxy: {
            '/api': {
                target: `http://${config.server.host}:${config.server.port}`, // express server
                secure: false,
            },
            '/public': {
                target: `http://${config.server.host}:${config.server.port}`, // express server
                secure: false,
            },
        },
    },
    devtool: IS_DEV ? 'cheap-module-source-map' : false,
};
