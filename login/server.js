const http = require('http')
const fs = require('fs')
const url = require('url')

const port = process.env.PORT || 8000

const server = http.createServer((request, response) => {
  let temp = url.parse(request.url, true)
  let path = temp.pathname
  let query = temp.query
  let method = request.method

  if (path === '/') {
    var string = fs.readFileSync('./index.html')
    response.setHeader('Content-Type', 'text/html;charset=utf-8')
    response.end(string)
  } else if (path === '/signUp' && method === 'POST') {
    getPostData(request, postData => {
      let errors = checkPostData(postData)
      if (Object.keys(errors).length === 0) {
        let { email, password } = postData
        let user = {
          email,
          passwordHash: hash(password) // 加密算法
        }
        // 写数据库
        let dbString = fs.readFileSync('./db.json', 'utf-8')
        let dbObject = JSON.parse(dbString)
        dbObject.users.push(user)
        let dbString2 = JSON.stringify(dbObject)
        fs.writeFileSync('./db.json', dbString2, { encoding: 'utf-8' })
      } else {
        response.statusCode = 400
      }

      response.setHeader('Content-Type', 'text/html;charset=utf-8')
      response.end(JSON.stringify(errors))
    })
  } else if (path === '/node_modules/jquery/dist/jquery.min.js') {
    let string = fs.readFileSync('./node_modules/jquery/dist/jquery.min.js')
    response.setHeader('Content-Type', 'application/javascript;charset=utf-8')
    response.end(string)
  } else if (path === '/main.js') {
    let string = fs.readFileSync('./main.js')
    response.setHeader('Content-Type', 'application/javascript;charset=utf-8')
    response.end(string)
  } else if (path === '/home') {
    let cookies = parseCookies(request.headers.cookie)
    response.setHeader('Content-Type', 'text/html;charset=utf-8')
    if(cookies.logined === 'true') {
      response.end(`${cookies.user_id}已登录`)
    } else {
      let string = fs.readFileSync('./home.html')
      response.end(string)
    }
  } else if (path === '/login' && method === 'POST') {
    // 读数据库
    getPostData(request, (postData) => {
      let dbString = fs.readFileSync('./db.json', 'utf-8')
      let dbObject = JSON.parse(dbString)
      let users = dbObject.users
      let { email, password } = postData
      let found
      for (let i = 0; i < users.length; i++) {
        if (users[i].email === email && users[i].passwordHash === hash(password)) {
          found = users[i]
          break
        }
      }
      if (found) {
        // 标记用户登录cookie
        response.setHeader('Set-Cookie', ['logined=true; expires=1000; path=/;', 'user_id=' + email + '; expires=123456789; path=/;'])
        response.end('')
      } else {
        response.statusCode = 400
        let errors = {email: '没注册或密码错误'} // 返回错误没处理
        response.setHeader('Content-Type', 'text/html;charset=utf-8')
        response.end(JSON.stringify(errors))
      }
    })
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

function checkPostData(postData) {
  let { email, password, password_confirmation } = postData
  let errors = {}
  // check email
  if (email.indexOf('@') < 0) {
    errors.email = '邮箱不合法'
  }
  if (password.length < 6) {
    errors.password = '密码太短'
  }
  if (password_confirmation !== password) {
    errors.password_confirmation = '两次密码输入不匹配'
  }
  return errors
}

function hash(string) {
  return string + 'hash'
}

function parseCookies(cookie) { // JSON.parse
  try {
    return cookie.split(';').reduce(
      function (prev, curr) {
        var m = / *([^=]+)=(.*)/.exec(curr);
        var key = m[1];
        var value = decodeURIComponent(m[2]);
        prev[key] = value;
        return prev;
      },
      {}
    );
  } catch (error) {
    return {}
  }
}

function stringifyCookies(cookies) { //JSON.stringify
  var list = [];
  for (var key in cookies) {
    list.push(key + '=' + encodeURIComponent(cookies[key]));
  }
  return list.join('; ');
}

server.listen(port)
console.log('监听 ' + port + ' 成功, 打开http://localhost:' + port) 
