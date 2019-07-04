/*
给ctx对象绑定render(view,model)
集成Nunjucks实际上也是编写一个middleware，这个middleware的作用是给ctx对象绑定一个render(view, model)的方法，这样，后面的Controller就可以调用这个方法来渲染模板了。
*/
const nunjcks = require('nunjucks');

function createEnv(path,opts) { 
    var autoescape = opts.autoescape === undefined ? true : opts.autoescape,
      noCache = opts.noCache || false,
      watch = opts.watch || false,
      throwOnUndefined = opts.throwOnUndefined || false,
      env = new nunjcks.Environment(//用来管理模版的类 loader(加载器)，opts(配置项)
        new nunjcks.FileSystemLoader(//内置加载器，这个只在node端使用
          path,//查找模版路径
          {//配置项
            noCache: noCache,//为true 不使用缓存，模版每次都编译
            watch:watch//为true 当文件系统上的模版变化自动更新，使用前确保安装了可选依赖chokidar
          }
        ),
        {//配置项
          autoescape: autoescape,//默认ture，是否被转义
          throwOnUndefined:throwOnUndefined//默认false 当输出null或undefined会抛出异常
        }
      );
    if (opts.filters) { 
      for (var f in opts.filters) { 
        env.addFilter(f, opts.filters[f]);
      }
    }
    return env;
    
}

function templating(path,opts) { 
    //创建nunjucks的env对象
    var env = createEnv(path, opts);
    return async (ctx, next) => {
        //给ctx绑定render函数：
        ctx.render= function (view,model) { 
            //把render后的内容赋值给response.body
            ctx.response.body = env.render(view, Object.assign({}, ctx.state || {}, model || {}));
            //设置content-type
            ctx.response.type = 'text/html';
        }
        await next();
    }
}

module.exports = templating;