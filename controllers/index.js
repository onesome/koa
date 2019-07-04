module.exports = {
    'GET /': async (ctx, next) => {
        ctx.render('login.html', {
            title: "登录页"
        })
    }
}
