const Koa = require("koa");
const app = new Koa();
const isProduction = process.env.NODE_ENV === 'production';
const bodyparser = require("koa-bodyparser");
const controller = require("./controller");
const templating = require("./middleware/templating");
// app.use(async (ctx,next) => {
//     await next();//调用下一个中间件
//     //设置响应方式
//     ctx.response.type = "text/html";
//     //设置响应内容
//     ctx.response.body = "<h1>hello koa2!</h1>";
// })

//计算响应耗时
app.use(async (ctx, next) => {
    let stpath = ctx.request.path;
    console.log(stpath);
    //请求方法和地址
    console.log(`proess ${ctx.request.method} and ${ctx.request.url}`);
    var start = Date.now(),
        ms;
    await next();
    ms = Date.now() - start;
    //设置响应时间
    ctx.response.set("X-Response-Time",`${ms}ms`); 
    console.log(`响应耗时为${ms}ms`);

})

//调用处理静态文件的中间件
/*
因为在生产环境下，静态文件是由部署在最前面的反向代理服务器（如Nginx）处理的，Node程序不需要处理静态文件。而在开发环境下，我们希望koa能顺带处理静态文件，否则，就必须手动配置一个反向代理服务器，这样会导致开发环境非常复杂。
*/
if (!isProduction) {//开发环境
    let staticFiles = require("./middleware/static_file");
    app.use(staticFiles("/static/", __dirname + "/static"));
}
console.log(__dirname);
//解析post请求
app.use(bodyparser());

/*
调用为ctx添加的render方法来使用cunjucks
isProduction，它判断当前环境是否是production环境。如果是，就使用缓存，如果不是，就关闭缓存。在开发环境下，关闭缓存后，我们修改View，可以直接刷新浏览器看到效果，否则，每次修改都必须重启Node程序，会极大地降低开发效率。

注：node在全局变量process中定义了一个环境变量env.NODE_ENV。因为我们在开发的时候，环境变量应该设置为‘development’，而部署到服务器时，环境变量应该设置为‘production’。在编写代码时要根据当前环境进行不同的判断。且在生产环境中必须配置环境变量NODE_ENV='production'，而开发环境不需要配置，实际上NODE_ENV可能时undfined，所以判断的时候不要NODE_ENV==='development'。
*/
app.use(templating('views', {
    noCache: !isProduction,
    watch: !isProduction
}));

//处理路由
app.use(controller());


app.listen(3000);
console.log("app started at port 3000...");