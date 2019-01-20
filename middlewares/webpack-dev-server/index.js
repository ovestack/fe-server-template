var webpack = require('webpack')
var expressMiddleware = require('webpack-dev-middleware')
var webpackConfig = getConfig('webpack')
var isLocal = getConfig('isLocal')
var PassThrough = require('stream').PassThrough
var compiler = webpack(
    require(webpackConfig)
)

function middleware(doIt, req, res) {
    var originalEnd = res.end;
    return function (done) {
        res.end = function () {
            originalEnd.apply(this, arguments);
            done(null, 0);
        };
        doIt(req, res, function () {
            done(null, 1);
        })
    }
}

var devMiddleware = function (compiler, option) {
    var doIt = expressMiddleware(compiler, option);
    return async function (ctx, next) {
        ctx.webpack = doIt;
        var runNext = await middleware(doIt, ctx.req, {
            end: function (content) {
                ctx.body = content;
            },
            setHeader: function () {
                ctx.set.apply(ctx, arguments);
            }
        });
        if (runNext) {
            await next();
        }
    };
};

var hotMiddleware = function (compiler, option) {
    var action = require('webpack-hot-middleware')(compiler, option);
    compiler.hooks.compilation.tap('WebPackDevMiddleware', function(compilation) {
        compilation.hooks.htmlWebpackPluginAfterEmit.tapAsync('WebPackDevMiddleware', function (htmlPluginData, callback) {
            action.publish({ action: 'reload' })
            callback()
        });
    })
    return async (ctx, next) => {
        let stream = new PassThrough()
        ctx.body = stream
        await action(ctx.req, {
            write: stream.write.bind(stream),
            writeHead: (status, headers) => {
                ctx.status = status
                ctx.set(headers)
            },
            end: function (content) {
                ctx.body = content;
            }
        }, next)
    }
}

module.exports = function (app) {
    if (!isLocal) return
    app.use(devMiddleware(compiler, {
        publicPath: webpackConfig.output.publicPath,
        stats: {
            colors: true,
            chunks: false
        },
        fs: require('fs')
    }))
    app.use(hotMiddleware(compiler, {
        reload: false
    }))
}
