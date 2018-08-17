var path = require('path'),
    util = require('./util'),
    vars = require('./vars')

const STATIC_PATH = vars.STATIC_PATH,
    SUB_PATH = vars.SUB_PATH,
    BASE_DIR = vars.BASE_DIR

module.exports = {
    entry: util.getEntrys('js'),
    output: {
        path: STATIC_PATH,
        publicPath: '/',
        filename: path.posix.join(SUB_PATH, 'js/[name].js')
    },
    resolve: {
        extensions: ['.js'],
        modules: [path.resolve(STATIC_PATH, '../node_modules')],
        alias: {}
    },
    resolveLoader: {
        modules: [path.resolve(STATIC_PATH, '../node_modules')]
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/
            },
            {
                test: /\.json$/,
                loader: 'json-loader'
            },
            {
                test: /\.(html|tpl)$/,
                loader: 'html-loader'
            },
            {
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                loader: 'url-loader',
                query: {
                    limit: 5000,
                    name: path.posix.join(SUB_PATH, 'img/[name].[hash:7].[ext]')
                }
            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                loader: 'url-loader',
                query: {
                    limit: 50,
                    name: path.posix.join(SUB_PATH, 'fonts/[name].[hash:7].[ext]')
                }
            }
        ]
    }
}