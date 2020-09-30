import { DateFormat } from '../../util/StringUtils';
export default class Store {

    constructor(view) {
        this.view = view;
        this.user = JSON.parse(sessionStorage.getItem("user"));
        this.serviceSpace = [{
            title: "ssh 服务器地址配置",
            group: []
        }]
    }

    findGroupByTitle(title) {
        for (var i = 0; i < this.serviceSpace.length; i++) {
            if (this.serviceSpace[i].title == title) {
                return this.serviceSpace[i];
            }
        }
        var newTitle = {};
        newTitle.title = title;
        newTitle.group = [];
        this.serviceSpace.push(newTitle);
        return newTitle;
    }

    loadServiceSpace() {
        //    this.view.setState({serviceSpace:this.serviceSpace});
        var _this = this;
        $.ajax({
            type: "POST",
            url: "/db/getAll",
            dataType: "json",
            data: {
                name:this.user
            },
            success: function (msg) {
                const status = msg.status;
                if (status == true) {
                    var data = msg.data;
                    for (var i = 0; i < data.length; i++) {
                        var space = data[i];
                        var title = space.title;
                        if ((!title) || title == "") continue;
                        var newTitle = _this.findGroupByTitle(title);
                        newTitle.group.push(space);
                    }
                    // console.log(JSON.stringify(_this.serviceSpace));
                    if(_this.serviceSpace[0].group.length>0){
                        _this.serviceSpace[0].group.sort(function(a,b){
                            return a.sdate > b.sdate ? 1:-1;
                        })
                    }
                    _this.view.setState({ serviceSpace: _this.serviceSpace });
                } else {
                    toastr.error("读取数据不成功！" + msg.data);
                }
            },
            error: function (err) {
                console.log(err);
            }
        });
        // return this.serviceSpace;
    }

    saveAloneSpace(data) {
        if (data) {
            data.own = this.user.username;
            data.sdate = DateFormat();
            console.log(data);
            var _this = this;
            $.ajax({
                type: "POST",
                url: "/db/insert",
                dataType: "json",
                data: {
                    "data": data
                },
                success: function (msg) {
                    const status = msg.status;
                    if (status == true) {
                        toastr.info(data.name + "保存成功！");
                        data._id = msg.id;
                        var newTitle = _this.findGroupByTitle(data.title);
                        newTitle.group.push(data);
                        _this.view.setState({
                            serviceSpace: _this.serviceSpace
                        });
                    } else {
                        toastr.error(name + "保存不成功！");
                    }
                },
                error: function (err) {
                    console.log(err);
                }
            });
        }
    }

    deleteSpace(title, id) {
        var newTitle = this.findGroupByTitle(title);
        if (newTitle) {
            for (var i = 0; i < newTitle.group.length; i++) {
                var spaceData = newTitle.group[i];
                if (spaceData._id == id){
                    spaceData._id = "delete"
                    break;
                }
            }
            console.log(JSON.stringify(this.serviceSpace))
            this.view.setState({
                 serviceSpace: this.serviceSpace
             });
        }
    }

}