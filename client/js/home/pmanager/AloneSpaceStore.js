export default class Store {

    constructor(view) {
        this.view = view;
        this.user = JSON.parse(sessionStorage.getItem("user"));
        this.token = null;
        this.id = null;
        if (this.view.state.data) {
            this.id = this.view.state.data._id;
        }
    }

    validOwn(callback) {
        if (callback) {
            callback(status);
        }
    }

    updateSpace(data) {
        var _this = this;
        $.ajax({
            type: "POST",
            url: "/db/update",
            dataType: "json",
            data: {
                'data': data,
                'token': _this.token
            },
            success: function (msg) {
                const status = msg.status;
                if (status == false) {
                    toastr.error("修改失败！");
                } else {
                    _this.view.state.data = Object.assign(_this.view.state.data, data);
                    _this.view.canelAction("view");
                    _this.view.props.onUpdateSpace();
                }
            },
            error: function (err) {
                console.log(err);
            }
        });
    }

    deleteSpace(title,id){
        var _this = this;
        let token = sessionStorage.getItem("user");
        $.ajax({
            type: "POST",
            url: "/db/delete",
            dataType: "json",
            data: {
                'id': id
                //'token': token
            },
            success: function (msg) {
               const status = msg.status;
               if (status == false) {
                    toastr.error("删除失败！");
                } else {
                    _this.view.props.onDeleteSpace(title,id);
                }
            },
            error: function (err) {
                console.log(err);
            }
        });
    }
}