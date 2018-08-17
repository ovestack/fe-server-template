'use strict'
exports.default = {
	'/adsdad/:id/:fu': function(ctx, id, fu) {
		console.log(id,fu)
	},
	'/test/:id/:ab': '/$id/llll/$ab',
	'/:ent_id/service/:xx': '/$version/index.html?id=$ent_id&xx=$xx',
    '/:module': async (ctx, mod_name, next) => {
        if (mod_name === 'test_mode') {
            ctx.redirect(mod_name+'/1.0.0/index.html')
        } else {
            await next()
        }
    }
}