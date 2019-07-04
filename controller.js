/*处理URL的文件（即router） */
//导入fs模块，然后使用readFileSync列出文件
//可以用sync是因为启动只运行了一次，不存在性能问题
var router = require('koa-router')();
var fs = require('fs');

function addcotroller(path) { 
  var pathstart = __dirname+"/"+path;
  var files = fs.readdirSync(pathstart);//文件名数组
  console.log(files);
  //过滤出js文件
  var js_files = files.filter((f) => {
    // console.log(f.endsWith(".js"));//true/false
    return f.endsWith(".js");
  })//文件为js的文件名数组

    // //处理每个js文件：
  for (var f of js_files) {
    console.log(`controller:${f}...`);
    addMapping(pathstart+ "/" + f);
  }
}

function addMapping(paths) { 
  //导入js文件
  let mapping = require(paths);
  console.log(mapping);
  for (var url in mapping) {
    // console.log(url.startsWith("GET "));
    if (url.startsWith("GET ")) {//如果地址开始类似 “GET xxx”
      var pathUrl = url.substring(4);//获取路径
      console.log(router.get);
      router.get(pathUrl,mapping[url]);
    }else if (url.startsWith('POST ')) { //如果地址开始类似 “POST xxx”
      var pathUrl = url.substring(5);
      console.log(pathUrl);
      console.log(router.post);
      router.post(pathUrl, mapping[url]);
    } else {
      console.log("error");
    }
  }
}
//导出文件
module.exports = function (dir) { 
  var path =dir|| "controllers";
  addcotroller(path);
  return router.routes();
}