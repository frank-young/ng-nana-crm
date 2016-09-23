var express = require('express')
var path = require('path')
var mongoose = require('mongoose')	
var session = require('express-session')
var mongoStore = require('connect-mongo')(session)
var bodyParser = require('body-parser')
// var multer = require('multer')
var cookieParser = require('cookie-parser')
var cookieSession = require('cookie-session')
var port = process.env.PORT || 3000	//设置端口
var app = express()		//启动一个web服务器
var dbUrl = 'mongodb://127.0.0.1/nanadb'
// var io = require('socket.io')(http)
mongoose.connect(dbUrl)

app.set('views','./app/views/pages')	//设置视图根目录
app.set('view engine','jade')	//设置默认的模板引擎

app.use(bodyParser.urlencoded({extended: true}))	//这里转换后才能使用  req.body里的内容
app.use(bodyParser.json())

app.use(express.static(path.join(__dirname,'frontend/src')))

// app.use(multer())
app.use(cookieParser())
app.use(cookieSession({
	secret: 'nana',
	name: 'session',
	keys:['key1','key2'],
	store:new mongoStore({
		url:dbUrl,
		collection: 'sessions'
	})
}))

require('./config/routes')(app)

app.locals.moment = require('moment')
app.listen(port)	//监听这个端口

console.log('nodetest start on port '+port)

