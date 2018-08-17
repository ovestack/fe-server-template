var webpack = require('webpack')
var expressMiddleware = require('webpack-dev-middleware')
var webpackConfig = getConfig('webpack')
var isLocal = getConfig().isLocal

var compiler = webpack(webpackConfig)

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
    return function* (next) {
        var ctx = this;
        ctx.webpack = doIt;
        var req = this.req;
        var runNext = yield middleware(doIt, req, {
            end: function (content) {
                ctx.body = content;
            },
            setHeader: function () {
                ctx.set.apply(ctx, arguments);
            }
        });
        if (runNext) {
            yield* next;
        }
    };
};

var hotMiddleware = function (compiler, option) {
    var action = require('webpack-hot-middleware')(compiler, option);
    compiler.plugin('compilation', function (compilation) {
        compilation.plugin('html-webpack-plugin-after-emit', function (data, cb) {
            action.publish({ action: 'reload' })
            cb()
            return true
        })
    })
    return function* (next) {
        var nextStep = yield middleware(action, this.req, this.res);
        if (nextStep && next) {
            yield* next;
        }
    };
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