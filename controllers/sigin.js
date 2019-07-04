module.exports = {
    'POST /sigin': async (ctx, next) => {
        var email = ctx.request.body.email || '',
            password = ctx.request.body.password || '';
        if (email == "admin@example.com" && password == "111111") {
            ctx.render("index.html", {
                title: "sigin ok",
                name: "zhangsan"
            })
        } else {
            ctx.render("fail.html", {
                title: "sigin fail"
            })
        }
    }
}