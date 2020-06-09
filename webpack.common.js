const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
module.exports = {
    mode: 'development',
    entry: {
        'index': './src/index.ts',
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
                            name: "[name].[contenthash].[ext]",
                        },
                    },
                    "extract-loader",
                    {
                        loader: "css-loader",
                        options: {
                            import: true,
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
            },
            {
                test: /\.(jpe?g|png)$/i,
                loader: 'responsive-loader',
                options: {
                    adapter: require('responsive-loader/sharp'),
                    outputPath: './assets/imgs'
                }
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
            filename: 'index.html'
        }),
        new CopyPlugin({
            patterns: [
                { from: 'src/assets/static', to: 'assets/static' },
            ]
        }),
    ],
    output: {
        //filename: '[hash].[name]',
        filename: '[name].[contenthash].js',
        path: path.resolve(__dirname, 'dist'),
    },
    optimization: {
        chunkIds: 'named',
        sideEffects: true,
        minimize: true,
        moduleIds: 'hashed',
        runtimeChunk: {
            name: 'runtime'
        },
        splitChunks: {
            cacheGroups: {
                commons: {
                    //test: /[\\/]node_modules[\\/](?!phaser[\\/])/,
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendor',
                    chunks: 'initial'
                }
            }
        }
    }
};
