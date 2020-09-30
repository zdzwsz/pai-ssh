import Modal from '../ModalView';
var Link = ReactRouterDOM.Link;
export default class HeadView extends React.Component {

    constructor(props, context) {
        super(props, context);
        this.user = JSON.parse(sessionStorage.getItem("user"));
        this.timeout = null;
    }

    componentDidMount() {
        //this.showUserListStatus(false);
    }

    showUserListStatus(status) {
        if (!status) {
            if (this.timeout == null) {
                this.timeout = setTimeout(function () {
                    $("#userListStatus").fadeOut(100);
                }, 300);
            }
        } else {
            if (this.timeout != null) {
                clearTimeout(this.timeout);
                this.timeout = null;
            }
            $("#userListStatus").fadeIn(200);
        }
    }

    openModalModifyPassword() {
        $("#passwordModal").css("top", "200px")
        $("#passwordModal").modal("show");
    }

    openModalAbout() {
        $("#aboutModal").css("top", "200px")
        $("#aboutModal").modal("show");
    }

    openDebugDevTools() {
        openDevTools();
    }

    changePassword() {
        let oldpwd = this.refs.oldpwd.value;
        let newpwd = this.refs.newpwd.value;
        let renpwd = this.refs.renpwd.value;
        if(oldpwd==""||newpwd==""||renpwd==""){
            toastr.info("请输入旧密码和新的密码！");
            return;
        }
        if(newpwd !== renpwd){
            toastr.info(" 新密码输入不对，请重新输入！");
            return
        }else{
            $("#passwordModal").modal("hide");
            this.refs.oldpwd.value = "";
            this.refs.newpwd.value = "";
            this.refs.renpwd.value = "";
            let username = this.user.username;
            console.log("username:"+username);
            $.ajax({
                type: "POST",
                url: "/repwd",
                dataType: "json",
                data: {
                    "oldpwd": oldpwd,
                    "newpwd": newpwd,
                    "userName": username
                },
                success: function (msg) {
                    const status = msg.status;

                    if (status == true) {
                        toastr.info(" 修改密码成功！");
                    } else {
                        toastr.error(msg.message," 修改密码失败！");
                    }
                },
                error: function (err) {
                    console.log(err);
                }
            });
        }
        
    }

    render() {
        return (
            <div style={{ "padding": 8 }}>
                <div className="ide-user" >
                    <span style={{ "cursor": "pointer" }} onMouseOver={this.showUserListStatus.bind(this, true)} onMouseOut={this.showUserListStatus.bind(this, false)}><span className="fa fa-user span-padding" ></span><span className="span-padding-right">{this.user.username} </span></span>
                    <Link to="/Home/manager" title="返回"><span className="fa fa-th span-padding"></span><span className="span-padding">地址配置</span> </Link>
                    <span onClick={this.openDebugDevTools.bind(this)} style={{ "cursor": "pointer" }}><span className="fa fa-cogs span-padding"></span><span>调试</span></span>
                </div>
                <div id="userListStatus" onMouseOver={this.showUserListStatus.bind(this, true)} onMouseOut={this.showUserListStatus.bind(this, false)} >
                    <ul className="list-group">
                        <li className="list-group-item" style={{ "cursor": "pointer" }} onClick={this.openModalModifyPassword.bind(this)}>修改密码</li>
                        <li className="list-group-item"><Link id="user_logout" to="/" title="重新登陆">重新登录</Link></li>
                        <li className="list-group-item" style={{ "cursor": "pointer" }} onClick={this.openModalAbout.bind(this)}>关于</li>
                    </ul>
                </div>
                <Modal id="passwordModal" title="修改密码" icon="fa fa-key" saveButton={this.changePassword.bind(this)}>
                    <div style={{ "padding": "30px 50px 10px 50px" }}>
                        <div className="form-group">
                            <input type="password" ref='oldpwd' className="form-control" placeholder="请输入旧密码" />
                        </div>
                        <div className="form-group">
                            <input type="password" ref='newpwd' className="form-control" placeholder="请输入新密码" />
                        </div>
                        <div className="form-group">
                            <input type="password" ref='renpwd' className="form-control" placeholder="请重复新密码" />
                        </div>
                    </div>
                </Modal>
                <Modal id="aboutModal" title="关于PAI-SSH" icon="fa fa-book">
                    <div>PAI-SSH 是一款好用又好玩，还免费，开源的SSH工具，由一个有点固执又好色的老程序员开发，关键代码写的还很烂，希望大家喜欢！</div>
                    <div>项目github地址：<a target="_blank" href="https://github.com/zdzwsz/pai-ssh">https://github.com/zdzwsz/pai-ssh</a></div>
                </Modal>
            </div>
        )
    }
}