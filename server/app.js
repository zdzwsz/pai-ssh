express = require('express');
var app = express();
//var http = require('http').Server(app);
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
const path = require('path');

//var log = require('./log.js');


var userService = require('./service/userService.js');
//var clanService = require('./service/clanService.js');
var sshService = require('./service/sshService.js');
var projectService = require('./service/projectService.js');
var dbService = require('./service/dbService.js');
const { join } = require('path');

//动态编译文件
/** 
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const config = require('../webpack.config.js');
process.noDeprecation = true;

const compiler = webpack(config);
 */


//日志
//log.use(app);

//动态编译文件
/** 
app.use(webpackHotMiddleware(compiler));
app.use(webpackDevMiddleware(compiler, {
    noInfo: true,
    publicPath: config.output.publicPath
}))
 */

//静态资源处理
//console.log(join(__dirname,'/client'));
const publicPath = path.resolve(__dirname, '../client');
//console.log("|"+publicPath);
app.use(express.static(publicPath));
//json提交参数处理
app.use(cookieParser());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({
    extended: true
}));

//服务请求处理
userService.init(app);

app.all('*', function (req, res, next) {
    userService.authentication(req, res, next);
});

//服务启动
var server = app.listen(11880, "localhost", function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log('Listening at ' + host + ':' + port);
});
var io = require('socket.io').listen(server);
//clanService.start(io);
sshService.init(app, io);
projectService.init(app,io);
dbService.init(app);
process.on('uncaughtException', function (err) {
    console.log(err);
    console.log(err.stack);
});
module.exports = server;