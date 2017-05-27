const http = require('http')
const fs = require('fs')
const url = require('url')

const port = process.env.PORT || 8000

const server = http.createServer((request, response) => {
  let temp = url.parse(request.url, true)
  let path = temp.pathname
  let query = temp.query
  let method = request.method

  if(path === '/') {
    var string = fs.readFileSync('./index.html')
    response.setHeader('Content-Type', 'text/html;charset=utf-8')
    response.end(string)
  } else if(path === '/signUp' && method === 'POST') {
    getPostData(request, postData => {
      let { email, password, password_confirmation } = postData
      let errors = {}
      // check email
      if(email.indexOf('@') < 0) {
        errors.email = '邮箱不合法'
      }
      if(password.length < 6) {
        errors.password = '密码太短'
      }
      if(password_confirmation !== password) {
        errors.password_confirmation = '两次密码输入不匹配'
      }
      response.setHeader('Content-Type', 'text/html;charset=utf-8')
      response.end(JSON.stringify(errors))
    })
  } else if(path === '/node_modules/jquery/dist/jquery.min.js') {
    let string = fs.readFileSync('./node_modules/jquery/dist/jquery.min.js')
    response.setHeader('Content-Type', 'application/javascript;charset=utf-8')
    response.end(string)
  } else if(path === '/main.js') {
    let string = fs.readFileSync('./main.js')
    response.setHeader('Content-Type', 'application/javascript;charset=utf-8')
    response.end(string)
  } else {
    response.statusCode = 404
    response.setHeader('Content-Type', 'text/html;charset=utf-8')
    response.end('找不到对应的路径， 你需要自行修改 index.js')
  }
  console.log(method + ' ' + request.url)  
})

function getPostData(request, callback) {
  data = ''
  request.on('data', chunk => {
    data += chunk.toString()
  })

  request.on('end', () => {
    let array = data.split('&')
    let postData = {}
    array.forEach(kv => {
      let parts = kv.split('=')
      let key = decodeURIComponent(parts[0])
      let value = decodeURIComponent(parts[1])
      postData[key] = value
    })
    callback.call(null, postData)
  })
}

server.listen(port)
console.log('监听 ' + port + ' 成功, 打开http://localhost:' + port) 
