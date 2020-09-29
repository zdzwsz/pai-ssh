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
            if(this.timeout == null){
                this.timeout = setTimeout(function () {
                    $("#userListStatus").fadeOut(100);
                }, 400);
            }
        } else {
            if (this.timeout != null) {
                clearTimeout(this.timeout);
                this.timeout =null;
            }
            $("#userListStatus").fadeIn(200);
        }
    }

    openDebugDevTools() {
        openDevTools();
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
                        <li className="list-group-item">系统配置</li>
                        <li className="list-group-item">修改密码</li>
                        <li className="list-group-item"><Link id="user_logout" to="/" title="重新登陆">重新登录</Link></li>
                    </ul>
                </div>
            </div>
        )
    }
}