import { DateFormat } from '../../util/StringUtils';
export default class Store {

    constructor(view) {
        this.view = view;
        this.user = JSON.parse(sessionStorage.getItem("user"));
        this.serviceSpace = [{
            title: "ssh 服务器地址配置",
            group: [],
            type: [0, 0, 0, 0, 0]
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
                name: this.user
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
                    _this.countType();
                    // console.log(JSON.stringify(_this.serviceSpace));
                    if (_this.serviceSpace[0].group.length > 0) {
                        _this.serviceSpace[0].group.sort(function (a, b) {
                            return a.sdate > b.sdate ? 1 : -1;
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

    /**  计算类别 */
    countType() {
        //console.log(this.serviceSpace[0]);
        this.serviceSpace[0].type = [0, 0, 0, 0, 0];
        //console.log(this.serviceSpace[0].type);
        for (var i = 0; i < this.serviceSpace[0].group.length; i++) {
            let space = this.serviceSpace[0].group[i];
            let team = space.team;
            if (space._id == "delete") continue;
            this.serviceSpace[0].type[4] = this.serviceSpace[0].type[4] + 1;
            if (team == "生产") {
                this.serviceSpace[0].type[0] = this.serviceSpace[0].type[0] + 1;
            } else if (team == "测试") {
                this.serviceSpace[0].type[1] = this.serviceSpace[0].type[1] + 1;
            } else if (team == "研发") {
                this.serviceSpace[0].type[2] = this.serviceSpace[0].type[2] + 1;
            } else {
                this.serviceSpace[0].type[3] = this.serviceSpace[0].type[3] + 1;
            }
        }
    }

    saveAloneSpace(data) {
        if (data) {
            data.own = this.user.username;
            data.sdate = DateFormat();
            //console.log(data);
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
                        _this.countType();
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
                if (spaceData._id == id) {
                    spaceData._id = "delete"
                    break;
                }
            }
            //console.log(JSON.stringify(this.serviceSpace))
            this.countType();
            this.view.setState({
                serviceSpace: this.serviceSpace
            });
        }
    }

    updateSpace() {
        this.countType();
        this.view.setState({
            serviceSpace: this.serviceSpace
        });
    }

}