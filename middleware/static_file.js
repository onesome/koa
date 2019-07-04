/*处理静态文件
mime 用来处理MIME类型模块
mz 提供的 API 和 Node.js 的 fs 模块完全相同，但 fs 模块使用回调，而 mz 封装了 fs 对应的函数，并改为 Promise，这样我们就可以非常简单的用 await 调用 mz 的函数，而不需要任何回调。  
*/
const mime = require('mime'),
    fs = require("mz/fs"),
    path=require("path");  

 /* 
 url 类似‘/static’
 dir 类似 _dirname+'/static'
 */
function staticFiles(url,dir) { 
    return async (ctx, next) => {
        let stpath = ctx.request.path;
        console.log(stpath);
        // 判断是否以指定的url开头
        if (stpath.startsWith(url)) {
            //获取文件的完整路径
            let fp = path.join(dir, stpath.substring(url.length));
            //判断文件是否存在
            console.log(fp);
            if (await fs.exists(fp)) { 
                //查找文件的mime
                ctx.response.type = mime.getType(stpath);
                //读取文件内容并赋值给response.body
                ctx.response.body = await fs.readFile(fp);
            } else {
                //文件不存在
                ctx.response.body = 404;
            }
        } else {
            //不是以指定的前缀url，继续处理下一个中间件
            await next();
        }
    }
}

module.exports = staticFiles;