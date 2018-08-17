module.exports = function(app) {
    app.get('/', async (ctx) => {
        await ctx.render('index')
    })
}
