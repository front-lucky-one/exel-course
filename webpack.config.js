// с помощью require мы подключаем плагин в нод жс
const path = require('path')
const { resolve } = require('path')
const HTMLWebpackPlugin = require('html-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const loader = require('sass-loader');

const isProd = process.env.NODE_ENV === 'production'
const isDev = !isProd

const filename = ext => isDev ? `bundle.${ext}` : `bundle.[hash].${ext}`
const jsLoader = () => {
    const loaders = [{
            loader: "babel-loader",
            options: {
                presets: ['@babel/preset-env']
            }
        }

    ]
    if (isDev) {
        loaders.push('eslint-loader')
    }
    return loaders
}
console.log('Prod', isProd)
console.log('dev', isDev)
module.exports = {
    // сперва указываем где лежат осходники приложения
    // вызываем метод резолв у найденого плагина 
    // и соединяем системную переменную __dirname(она указывает на абсолютный путь к папке)
    // и src
    context: path.resolve(__dirname, 'src'),
    // моде указывает на режим разработки
    mode: 'development',
    // входные точки для приложения
    entry: "./index.js",
    // output это обьект настроек для конечного вывода js
    output: {
        // имя конечного файла с скриптами
        filename: filename('js'),
        // путь куда будут выгражаться конечные файлы js
        path: resolve(__dirname, 'dist')


    },
    //
    resolve: {
        // по умолчанию загрузка js
        extensions: ['.js'],
        // алиас это символ который сокращает путь 
        alias: {
            "@": path.resolve(__dirname, 'src'),
            "@core": path.resolve(__dirname, 'src/core')
        }
    },
    devtool: isDev ? "source-map" : false,
    devServer: {
        hot: isDev,
        port: 9000,
        contentBase: path.join(__dirname, 'dist')
    },
    plugins: [
        new CleanWebpackPlugin(),
        new HTMLWebpackPlugin({
            template: 'index.html',
            minify: {
                removeComments: isProd,
                collapseWhitespace: isProd
            }
        }),
        new MiniCssExtractPlugin({
            filename: filename('css')
        }),
        new CopyPlugin({
            patterns: [
                { from: path.resolve(__dirname, 'src/favicon.ico'), to: path.resolve(__dirname, 'dist') },

            ],
        }),
    ],
    module: {
        // описывает правила для лоадеров
        rules: [{
                // расширение sass или сss или scss
                test: /\.s[ac]ss$/i,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'sass-loader',
                ],
            },
            {
                test: /\.m?js$/,
                exclude: /node_modules/,
                use: jsLoader(),
            }
        ],
    },
}