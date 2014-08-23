var connect = require('connect')
var serveStatic = require('serve-static')
var http = require('http')
var fs = require('fs')

var sourcePath = __dirname + '/../source'

http.createServer(
  connect()
    .use(serveStatic(sourcePath))
    .use(function(req, res) {
      fs.createReadStream(sourcePath + '/index.html').pipe(res)
    })
).listen(8080)

