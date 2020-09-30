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

    addUser(name,pwd,rpwd){
        if (name == '' || pwd == '' ||rpwd=="") {
            toastr.info("请输入用户信息！");
            return;
        } 
        if(pwd !== rpwd){
            toastr.info(" 密码输入不对，请重新输入！");
            return;
        }else{
            $.ajax({
                type: "POST",
                url: "/newuser",
                dataType: "json",
                data: {
                    "newpwd": pwd,
                    "userName": name
                },
                success: function (msg) {
                    const status = msg.status;
                    if (status == true) {
                        toastr.info(" 新增用户成功！");
                    } else {
                        toastr.error(msg.message," 新增用户失败！");
                    }
                },
                error: function (err) {
                    console.log(err);
                }
            });
        }
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

