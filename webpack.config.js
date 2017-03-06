'use strict';
// webpack.config.js

const ExtractTextPlugin = require("extract-text-webpack-plugin");
const path = require('path');

const extractSass = new ExtractTextPlugin({
    filename: "style.css",
    disable: false,
    allChunks: true,
});

module.exports = {
    entry: './assets/index.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'source/assets'),
    },
    module: {
        rules: [{
            test: /\.css$/,
            use: extractSass.extract({
                use: [{
                    loader: "css-loader",
                    options: {
                        sourceMap: true,
                    }
                }],
            })
        }, {
            test: /\.scss$/,
            use: extractSass.extract({
                use: [{
                    loader: "css-loader",
                    options: {
                        sourceMap: true,
                    }
                }, {
                    loader: "sass-loader",
                    options: {
                        sourceMap: true,
                    }
                }],
            })
        }, {
            test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
            use: {
                loader: 'url-loader',
                options: { limit: 10000 }
            }
        }]
    },
    plugins: [
        extractSass,
    ],
};
