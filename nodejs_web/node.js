//引用HTTP模块
const HTTP = require('http');
//引入路径模块
const PATH = require('path');
//引入文件模块
const FS = require('fs');
// 引入 querystring 模块 
const QUERYSTRING = require('querystring');
//引入mime模块
const MIME = require("mime");
//设置网站根目录
const ROOTPATH = PATH.join(__dirname, 'www');
HTTP.createServer((request, response) => {
    //获取请求地址
    let filePath = PATH.join(ROOTPATH, QUERYSTRING.unescape(request.url));
    //判断请求地址是否存在
    if (FS.existsSync(filePath)) {
        //如果存在
        //判断是否是文件夹  fs.readdir()读取目录
        FS.readdir(filePath, (err, files) => {
            if (err) {
                //不是目录,是文件 直接读取文件并返回
                FS.readFile(filePath, (err, data) => {
                    if (err) {
                        response.end(err);
                    } else {
                        response.writeHead(200, {
                            "content-type": MIME.getType(filePath) + ";charset=utf-8"
                        })
                        response.end(data);
                    }
                })
            } else {
                //是目录 判断目录里有没有首页  有返回首页 没有展示目录内容
                if (files.indexOf('index.html')!=-1) {
                    FS.readFile(PATH.join(filePath, 'index.html'), (err, data) => {
                        if (err) {
                            response.end(err);
                        } else {
                            response.writeHead(200, {
                                "content-type": MIME.getType(filePath) + ";charset=utf-8"
                            })
                            response.end(data);
                        }
                    })
                } else {
                    let backDataStr = "";
                    for (i = 0; i < files.length; i++) {
                        backDataStr += `<h3><a href="${request.url=='/'?'':request.url}/${files[i]}">${files[i]}</a></h3>`
                    }
                    response.writeHead(200, {
                        "content-type": "text/html;charset=utf-8"
                    })
                    response.end(backDataStr);
                }
            }
        })
    } else {
        //如果不存在,重写响应头,返回404
        response.writeHead(404, {
            "content-type": "text/html;charset=utf-8"
        })
        response.end('404');
    }
}).listen(80, '127.0.0.1', () => {
    console.log("开始监听");
})