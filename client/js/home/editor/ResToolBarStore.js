export default class Store {
    constructor(view,id) {
        this.view = view;
        this.id = id;
    }

    addFolder(path) {
        var _this = this;
        $.ajax({
            type: "POST",
            url: "/sshProject/addfolder",
            dataType: "json",
             data: {
                    "path": path,
                    "id":  _this.id
                },
            success: function (msg) {
                toastr.info("新建文件夹成功！");
            },
            error: function (err) {
                console.log(err);
                toastr.error("新建文件夹失败，请重新刷新目录");
            }
        });
    }

    addFile(path) {
        var _this = this;
        $.ajax({
            type: "POST",
            url: "/sshProject/addfile",
            dataType: "json",
             data: {
                    "path": path,
                    "id":  _this.id
                },
            success: function (msg) {
                toastr.info("新建文件成功！");
            },
            error: function (err) {
                console.log(err);
                toastr.error("新建文件失败，请重新刷新目录");
            }
        });
    }

    listDir(path,jsonData){
        var _this = this;
        if(jsonData.sub && jsonData.sub.length>0){
            return;
        }
        $.ajax({
            type: "POST",
            url: "/sshProject/dir",
            dataType: "json",
             data: {
                    "path": path,
                    "id":  _this.id
                },
            success: function (msg) {
                //console.log(JSON.stringify(jsonData));
                jsonData.sub = msg.status.sub;
                //console.log(JSON.stringify(jsonData));
                _this.view.setState({
                    data: _this.view.state.data
                });
            },
            error: function (err) {
                console.log(err);
            }
        });
    }

    reNameFile(oldPath, newPath){
        var _this = this;
        $.ajax({
            type: "POST",
            url: "/sshProject/renamefile",
            dataType: "json",
             data: {
                    "oldPath": oldPath,
                    "newPath": newPath,
                    "id":  _this.id
                },
            success: function (msg) {
                toastr.info("重命名文件成功！");
            },
            error: function (err) {
                console.log(err);
                toastr.error("重命名文件失败，请重新刷新目录！");
            }
        });
    }

     deleteFile(path){
        var _this = this;
        $.ajax({
            type: "POST",
            url: "/sshProject/deletefile",
            dataType: "json",
             data: {
                    "path": path,
                    "id":  _this.id
                },
            success: function (msg) {
                toastr.info("删除文件成功！");
            },
            error: function (err) {
                console.log(err);
                toastr.error("删除文件失败，请重新刷新目录！");
            }
        });
    }

    copyFile(oldPath,newPath){
        var _this = this;
        $.ajax({
            type: "POST",
            url: "/sshProject/copyfile",
            dataType: "json",
             data: {
                    "oldPath": oldPath,
                    "newPath": newPath,
                    "id":  _this.id
                },
            success: function (msg) {
                toastr.info("复制文件成功！");
            },
            error: function (err) {
                console.log(err);
                toastr.info("复制文件失败，请重新刷新目录");
            }
        });
    }

    cutFile(oldPath,newPath){
        var _this = this;
        //if(1==1)return;
        $.ajax({
            type: "POST",
            url: "/sshProject/cutfile",
            dataType: "json",
             data: {
                    "oldPath": oldPath,
                    "newPath": newPath,
                    "id":  _this.id
                },
            success: function (msg) {
                toastr.info("剪切文件成功！");
            },
            error: function (err) {
                console.log(err);
                toastr.error("剪切文件失败，请重新刷新目录");
            }
        });
    }

    download(name,path){
       let url="/sshProject/downloadfile"
       let inputs='<input type="hidden" name="name" value="'+ name +'" />'
       inputs+='<input type="hidden" name="path" value="'+ path +'" />'
       inputs+='<input type="hidden" name="id" value="'+ this.id +'" />'
       $('<form target="_blank" action="'+ url +'" method="'+ 'post' +'">'+inputs+'</form>')
        .appendTo('body').submit();
    }
}