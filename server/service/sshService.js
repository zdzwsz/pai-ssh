var Client = require('ssh2').Client;
var dbService = require('./dbService.js');
var commandUtil = require('../util/CommandUtil.js');
var timeoutSec = 1000 * 60 * 10;

var timeoutwarn = 1000 * 60;
var sshService = {
    io: null,
    nowTime: new Date().getTime(),
    init(app, io) {
        this.io = io;
        var _this = this;
        app.post('/ssh/:id', function (req, res, next) {
            let id = req.params.id;
            let host = req.body.host;
            if (host == null || host == "") {
                res.send({ 'status': false });
                return;
            }
            dbService.getSpace(host, function (err, docs) {
                if (err) {
                    res.send({ 'status': false });
                } else {
                    var spaceInfo = docs[0];
                    try {
                        _this.start("/" + id, spaceInfo);
                        res.send({ 'status': true });
                    } catch (e) {
                        console.log(e);
                        res.send({ 'status': false });
                    }
                }
            })

        })
    },
    start(name, spaceInfo) {
        //console.log("start ssh:" + name);
        let nsp = this.io.of(name);
        let _this = this;
        var conn = null;
        let nowTime = new Date().getTime();
        let timeout = null;
        let rows = 24;
        let cols = 80;
        nsp.on('connection', function (socket) {
            let timeoutCheckSec = 1000 * 60;
            var setTimeoutFunction = function () {
                timeout = setTimeout(function () {
                    if (new Date().getTime() - nowTime > timeoutSec) {
                        console.log("timeout stop");
                        try {
                            conn.end();
                            nsp.emit('disconnect');
                        } catch (e) {
                            console.log(e);
                        }
                    } else {
                        let nowTimes = new Date().getTime() - nowTime;
                        let time = timeoutSec - nowTimes;
                        console.log('check: ' + nowTimes + "|" + timeoutwarn);
                        if (time < (timeoutwarn + 3)) {
                            if (time > 1000 * 30) {
                                timeoutCheckSec = 1000 * 15;
                            } else {
                                timeoutCheckSec = 1000 * 5;
                            }
                            console.log('countdown: ' + time);
                            nsp.emit('timeout', time);
                        } else {
                            timeoutCheckSec = 1000 * 60;
                        }
                        setTimeoutFunction();
                    }
                }, timeoutCheckSec)
            };
            socket.on("init", function (data) {
                rows = data.rows;
                cols = data.cols;
                nsp.emit('init-over');
            });
            socket.on("connectionssh", function (obj) {
                command = ""
                conn = new Client();
                conn.on('ready', function () {
                    conn.shell({ rows: rows, cols: cols,term:"xterm" }, function (err, stream) {
                        if (err) {
                            console.log(err);
                            conn.end();
                            nsp.emit('disconnect');
                        }
                        //let initTime = 0;
                        //===========================正式连接==================
                        _this.nowTime = new Date().getTime();
                        setTimeoutFunction();
                        stream.on('close', function () {
                            console.log('Stream :: close');
                            conn.end();
                            nsp.emit('disconnect');
                            if (timeout != null)
                                clearTimeout(timeout);
                        }).on('data', function (data) {
                            nsp.emit('sshdata', Buffer.from(data));
                            nowTime = new Date().getTime();
                        }).stderr.on('data', function (data) {
                            console.log('STDERR: ' + data);
                        });
                        //========================================================
                        socket.on('sshdata', function (data) {//客户端发送数据到web服务器，服务器再将数据发送到ssh服务器
                            stream.write(data);
                        });

                        socket.on('prompt',function(data){//根据客户端发送的命令，查询服务端提供命令帮助
                            prompt = commandUtil.getPrompt(data);
                            if(prompt){
                                nsp.emit('prompt', prompt);
                            }else{
                                nsp.emit('prompt', data);
                            }
                        })
                        socket.on('prompt_specific',function(data){//根据客户端发送的命令，查询服务端提供命令帮助
                            prompt = commandUtil.getSpecific(data);
                            if(prompt){
                                nsp.emit('prompt_specific', prompt);
                            }else{
                                nsp.emit('prompt_specific', "没有配置命令详解");
                            }
                        })
                    });
                }).connect(spaceInfo);

            });
            socket.on("closeTerm", function (obj) {
                //console.log('SSH :: close');
                conn.end();
                nsp.emit('disconnect');
                if (timeout != null)
                    clearTimeout(timeout);
            })
        })
    }

}
module.exports = sshService;