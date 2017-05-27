var http = require('http')
var fs = require('fs')
var url = require('url')

var port = process.env.PORT || 8000

var server = http.createServer(function(request, response) {
  var temp = url.parse(request.url, true)
  var path = temp.pathname
  var query = temp.query
  var method = request.method

  if(path === '/') {
    var string = fs.readFileSync('./index.html')
    response.setHeader('Content-Type', 'text/html;charset=utf-8')
    response.end(string)
  } else {
    response.statusCode = 404
    response.setHeader('Content-Type', 'text/html;charset=utf-8')
    response.end('找不到对应的路径， 你需要自行修改 index.js')
  }
  console.log(method + ' ' + request.url)  
})
server.listen(port)
console.log('监听 ' + port + ' 成功, 打开http://localhost:' + port) 
