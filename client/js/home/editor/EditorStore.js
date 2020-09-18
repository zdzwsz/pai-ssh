export default class Store {
    constructor(view) {
        this.view = view;
    }

    loadProject() {
        var _this = this;
        $.ajax({
            type: "POST",
            url: "/sshProject",
            dataType: "json",
            data: {
                "id": _this.view.sshConfig.host
            },
            success: function (msg) {
                console.log("treeData:" + JSON.stringify(msg));
                const status = msg.status;
                if(status == false){
                    let message = JSON.stringify(msg.message);
                    toastr.error("连接SSH服务器失败，服务配置是否正确?"+message);
                    _this.view.setState({
                        sshnolink: true
                    });
                    return;
                }
                //_this.view.state.treeData = status;
                //_this.view.setState(_this.view.state);
                _this.view.setState({
                    treeData: status
                });
            },
            error: function (err) {
                console.log(err);
            }
        });
    }

    loadFileCode(path, name, cb) {
        var _this = this;
        $.ajax({
            type: "POST",
            url: "/sshProject/read",
            dataType: "json",
            data: {
                "id": _this.view.sshConfig.host,
                "path": path,
                "name": name
            },
            success: function (msg) {
                //console.log("code:" + JSON.stringify(msg.status));
                const code = msg.status;
                _this.view.state.codeData.push({
                    "name": name,
                    "path": path,
                    "code": code
                });
                _this.view.state.tabIndex.value = _this.view.state.codeData.length - 1;
                _this.view.setState(_this.state);
            },
            error: function (err) {
                console.log(err);
            }
        });
    }

    saveFileCode(path, name,code){
        var _this = this;
        $.ajax({
            type: "POST",
            url: "/sshProject/save",
            dataType: "json",
            data: {
                "id": _this.view.sshConfig.host,
                "path": path,
                "name": name,
                "code":code
            },
            success: function (msg) {
                //console.log("msg:" + JSON.stringify(msg.status));
                const code = msg.status;
                if(code==false){
                     toastr.error(name + "保存不成功！");
                }else{
                    toastr.info(name + "保存成功！");
                }
            },
            error: function (err) {
                console.log(err);
            }
        });
    }

}