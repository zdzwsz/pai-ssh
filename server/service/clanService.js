var clanService = {
    //在线用户
    onlineUsers: {},
    //当前在线人数
    onlineCount: 0,

    nsp: null,

    start(io) {
        let _this = this;
        _this.nsp = io.of('/clan');
        _this.nsp.on('connection', function (socket) {
            console.log('user connected');
            socket.on('login', function (obj) {
                //将新加入用户的唯一标识当作socket的名称，后面退出的时候会用到
                socket.name = obj.userid;
                //检查在线列表，如果不在里面就加入
                if (!_this.onlineUsers.hasOwnProperty(obj.userid)) {
                    _this.onlineUsers[obj.userid] = obj.username;
                    //在线人数+1
                    _this.onlineCount++;
                }
                //向所有客户端广播用户加入
                _this.nsp.emit('login', { onlineCount: _this.onlineCount, user: obj });
                console.log(obj.username + ' join clan');
            });
            //监听用户退出
            socket.on('disconnect', function () {
                //将退出的用户从在线列表中删除
                if (_this.onlineUsers.hasOwnProperty(socket.name)) {
                    //退出用户的信息
                    var obj = { userid: socket.name, username: _this.onlineUsers[socket.name] };
                    //删除
                    delete _this.onlineUsers[socket.name];
                    //在线人数-1
                    _this.onlineCount--;
                    //向所有客户端广播用户退出
                    _this.nsp.emit('logout', { onlineCount: _this.onlineCount, user: obj });
                    console.log(obj.username + ' quit');
                }
            });
            //监听用户发布聊天内容
            socket.on('message', function (obj) {
                //向所有客户端广播发布的消息
                _this.nsp.emit('message', obj);
                console.log(obj.username + ' say：' + obj.content);
            });
        });
    }
}
module.exports = clanService;
