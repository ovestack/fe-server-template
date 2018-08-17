var path = require('path'),
    fs = require('fs'),
    crypto = require('crypto'),
    url = require('url')

function UriPlugin(options) {
    options = options || {}
    this.publicPath = options.publicPath || 'static'
    this.root = options.root || '/'
    this.hash = options.hash
    this.hashlen = options.hashlen || 0
}

UriPlugin.prototype.toHash = function(input, limit) {
    var md5 = crypto.createHash('md5')
    md5.update(input)
    return limit ? md5.digest('hex').slice(0, limit) : md5.digest('hex')
}

UriPlugin.prototype.getAssetsPath = function(asset) {
    var extname = path.extname(asset)
    if (extname.match(/\.(png|jpe?g|gif|svg)(\?.*)?$/)) {
        return 'img/'
    } else if (extname.match(/\.(woff2?|eot|ttf|otf)(\?.*)?$/)) {
        return 'fonts/'
    } else {
        return ''
    }
}

UriPlugin.prototype.addInlineAssets = function(html, compilation, ctx) {
    var INLINE_TAG = /__inline\([\"|']([^)]*)[\"|']\)/igm,
        self = this
    return html.replace(INLINE_TAG, function(raw, url) {
        var source = fs.readFileSync(path.resolve(ctx,url)).toString()
        return JSON.stringify(source)
    })
}

UriPlugin.prototype.getAssetName = function(pathname, extname, source) {
    var hash = ''
    if (this.hash) {
        hash = this.toHash(source, this.hashlen)
    }
    return path.basename(pathname).replace(extname, '') + (hash ? '.' + hash : '') + extname
}

UriPlugin.prototype.addUriAssets = function(html, compilation, ctx) {
    var URI_TAG = /__uri\([\"|']([^)]*)[\"|']\)/igm,
        self = this
    return html.replace(URI_TAG, function(raw, assetUrl) {
        assetUrl = url.parse(assetUrl)
        var pathname = assetUrl.pathname,
            extname = path.extname(pathname),
            source = fs.readFileSync(path.resolve(ctx,pathname))
        var assetName = self.getAssetName(pathname, extname, source)
        var asset = path.join(self.publicPath, self.getAssetsPath(pathname), assetName)
        compilation.assets[asset] = {
            source: function() { return source },
            size: function() { return Buffer.byteLength(this.source(), 'utf8') }
        }
        return JSON.stringify(path.join(self.root, asset) + assetUrl.search)
    })
}

UriPlugin.prototype.apply = function(compiler) {
    var self = this
    compiler.plugin('compilation', function(compilation) {
        compilation.plugin('html-webpack-plugin-before-html-processing', function(htmlPluginData, callback) {
            var ctx = path.dirname(htmlPluginData.plugin.options.template.split('!')[1])
            htmlPluginData.html = self.addInlineAssets(htmlPluginData.html, compilation, ctx)
            htmlPluginData.html = self.addUriAssets(htmlPluginData.html, compilation, ctx)
            callback(null, htmlPluginData)
        })
    })
}

module.exports = UriPlugin