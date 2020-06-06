const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
    mode: 'development',
    entry: {
        'game.js': './src/game.ts',
        //'style.css': './src/index.css',
    },
    devtool: 'source-map',
    devServer: {
        contentBase: './dist',
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: 'ts-loader',
                exclude: [/node_modules/],
                options: { configFile: path.resolve(__dirname, 'tsconfig.json') }
            },
            {
                test: /\.css$/,
                use: [
                    {
                        loader: "file-loader",
                        options: {
                            name: "[name].[ext]",
                        },
                    },
                    "extract-loader",
                    {
                        loader: "css-loader",
                        options: {
                            sourceMap: true
                        }
                    }
                ]
            },
            {
                test: /\.html$/i,
                loader: 'html-loader',
            },
            {
                test: /\.jpg$/,
                use: "file-loader"
            }
        ],
    },
    resolve: {
        // Add `.ts` and `.tsx` as a resolvable extension.
        extensions: [".ts", ".tsx", ".js"]
    },
    plugins: [
        new CleanWebpackPlugin({ cleanStaleWebpackAssets: false }),
        new HtmlWebpackPlugin({
            title: 'Development',
            template: './src/index.html',
        }),
    ],
    output: {
        filename: '[hash].[name]',
        path: path.resolve(__dirname, 'dist'),
    },
    optimization: {
        chunkIds: 'named',
        sideEffects: true,
        minimize: true,
        moduleIds: 'hashed',
        runtimeChunk: {
            name: 'runtime.js'
        },
        splitChunks: {
            cacheGroups: {
                commons: {
                    test: /[\\/]node_modules[\\/]/,
                    filename: '[hash].vendor.js',
                    chunks: 'all'
                }
            }
        }
    }
};
