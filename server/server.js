var express = require('express')
var http = require('http')
var logger = require('morgan')

var app = express()

app.engine('html', require('ejs').renderFile)

app.use(logger('dev'))
app.use('/vendor/', express.static(__dirname + '/../build/vendor/'))
app.use('/css/', express.static(__dirname + '/../build/css/'))
app.use('/js/', express.static(__dirname + '/../build/js/'))
app.use('/html/', express.static(__dirname + '/../build/html/'))
app.use('/config.js', express.static(__dirname + '/../build/config.js'))

app.get('/*', function(req, res) {
  res.render(__dirname + '/../build/index.html')
})

http.createServer(app).listen(8000, function() {
  console.log('Express server listening on port ' + 8000)
})

module.exports = app