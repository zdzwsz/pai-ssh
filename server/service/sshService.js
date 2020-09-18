var Client = require('ssh2').Client;
var dbService = require('./dbService.js');
var timeoutSec = 1000 * 60 * 10;

var timeoutwarn = 1000 * 60;
var sshService = {
    io: null,
    nowTime : new Date().getTime(),
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
        let _this =this;
        var conn = null;
        let nowTime =  new Date().getTime();
        let timeout = null;
        nsp.on('connection', function (socket) {
            let timeoutCheckSec = 1000 * 60;
            var setTimeoutFunction=function(){
                timeout = setTimeout(function(){
                    if (new Date().getTime() - nowTime > timeoutSec) {
                        console.log("timeout stop");
                        try{
                            conn.end();
                            nsp.emit('disconnect');
                        }catch(e){
                            console.log(e);
                        }
                    } else {
                        let nowTimes = new Date().getTime() - nowTime;
                        let time = timeoutSec - nowTimes;
                        console.log('check: ' + nowTimes + "|"+timeoutwarn);
                        if(time < (timeoutwarn+3)){
                            if(time > 1000 * 30){
                                timeoutCheckSec = 1000 * 15;
                            }else{
                                timeoutCheckSec = 1000 * 5;
                            }
                            console.log('countdown: ' + time);
                            nsp.emit('timeout', time);
                        }else{
                            timeoutCheckSec = 1000 * 60;
                        }
                        setTimeoutFunction();
                    }
                }, timeoutCheckSec)
            };
            socket.on("connectionssh", function (obj) {
                conn = new Client();
                conn.on('ready', function () {
                    conn.shell(function (err, stream) {
                        if (err){
                            console.log(err);
                            conn.end();
                            nsp.emit('disconnect');
                        }
                        _this.nowTime = new Date().getTime();
                        setTimeoutFunction();
                        stream.on('close', function () {
                            console.log('Stream :: close');
                            conn.end();
                            nsp.emit('disconnect');
                            if(timeout != null)
                              clearTimeout(timeout);
                        }).on('data', function (data) {
                            nsp.emit('sshdata', data.toString());
                            nowTime = new Date().getTime();
                            //console.log('STDOUT: ' + data);
                        }).stderr.on('data', function (data) {
                            console.log('STDERR: ' + data);
                        });
                        socket.on('sshdata', function (data) {
                            stream.write(data);
                        });
                    });
                }).connect(spaceInfo);
                
            });
            socket.on("closeTerm", function (obj) {
                console.log('SSH :: close');
                conn.end();
                nsp.emit('disconnect');
                if(timeout != null)
                  clearTimeout(timeout);
            })
        })
    }
   
}
module.exports = sshService;