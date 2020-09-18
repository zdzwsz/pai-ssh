import {generateUUID} from '../util/StringUtils'
export default class Store {
    constructor(view) {
        this.view = view;
    }
  
    storeUser(userName,token) {
        let user = { "userid": generateUUID(), "username": userName}
        sessionStorage.setItem("user", JSON.stringify(user));
        //console.log(token); 
        $.cookie('token', token);
        //console.log($.cookie('token')); 
    }

    login(name, pass) {
        if (name == '' || pass == '') {
            this.view.setState({
                errorMsg: '请输入用户名/密码'
            });
        } else {
            var _this = this;
            $.ajax({
                type: "POST",
                url: "/login",
                dataType: "json",
                data: {
                    "name": name,
                    "pass": pass
                },
                success: function (msg) {
                    const status = msg.status;
                    if (status == true) {
                        let token =  msg.token
                        _this.storeUser(name,token);
                        _this.view.setState({
                            redirectToReferrer: true
                        });
                    } else {
                        _this.view.setState({
                            errorMsg: '用户名/密码不正确！'
                        });
                    }
                },
                error: function (err) {
                    console.log(err);
                }
            });
        }
    }
}

