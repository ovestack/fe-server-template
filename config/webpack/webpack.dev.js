var merge = require('webpack-merge'),
    HtmlWebpackPlugin = require('html-webpack-plugin'),
    LiveReloadPlugin = require('webpack-livereload-plugin'),
    UriLoaderPlugin = require('./webpack-uri-loader'),
    path = require('path'),
    util = require('./util'),
    vars = require('./vars'),
    base_config = require('./webpack.base')

const HTML_ENTRYS = util.getEntrys('html'),
    JS_ENTRYS = util.getEntrys('js'),
    STATIC_PATH = vars.STATIC_PATH,
    SUB_PATH = vars.SUB_PATH

module.exports = merge(base_config, {
    module: {
        rules: [
            {
                test: /\.css$/,
                loader: ['style-loader', 'css-loader']
            },
            {
                test: /\.less$/,
                loader: ['style-loader', 'css-loader', 'less-loader']
            }
        ]
    },
    plugins: Object.keys(HTML_ENTRYS).map(function(key) {
        var entry = HTML_ENTRYS[key],
            filename = util.genHtmlFileName(entry)
        var config = {
            filename: path.join(STATIC_PATH, filename),
            template: entry,
            inject: true
        }
        if (JS_ENTRYS.hasOwnProperty(key)) {
            config.chunks = [key]
        } else {
            config.chunks = []
        }
        return new HtmlWebpackPlugin(config)
    }).concat(new LiveReloadPlugin(), new UriLoaderPlugin({
        publicPath: SUB_PATH,
        root: '/',
        hash: true,
        hashlen: 7
    }))
})