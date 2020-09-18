import Store from './LoginStore'
var Redirect = ReactRouterDOM.Redirect;
export default class LoginView extends React.Component {

    constructor(props) {
        super(props);
        this.login = this.login.bind(this);
        this.state = {
            errorMsg: "",
            redirectToReferrer: false
        };
        this.store = new Store(this);
    }

    login(e) {
        e.preventDefault();
        let name = this.refs.name.value;
        let pass = this.refs.pass.value;
        this.store.login(name, pass);
    }
    render() {
        if (this.state.redirectToReferrer) {
            return (
                <Redirect to={'/Home'} />
            )
        }

        var errorMsg;
        if (this.state.errorMsg != "") {
            errorMsg = (
                <div className="alert alert-warning">{this.state.errorMsg}</div>
            );
        }

        return (
            <div className="container" style={{ "padding-top": "130px" }}>
                <div className="col-md-offset-3 col-lg-offset-3 col-md-6 col-lg-6">
                    <div className="panel panel-default">
                        <div style={{ padding: "20px" }}>
                            <form onSubmit={this.login}>
                                <div className="text-center">
                                    <h1 className="page-header"><span className="fa fa-lock span-padding"></span>用户登录</h1>
                                </div>
                                <div className="form-group">
                                    <input type="text" ref='name' className="form-control" placeholder="请输入用户名" />
                                </div>
                                <div className="form-group">
                                    <input type="password" ref='pass' className="form-control" placeholder="请输入密码" />
                                </div>
                                <div className="form-group">
                                    <span className="span-padding span-padding-right span-padding-left"><input type="submit" className="btn btn-default" value="用户登录" /></span>
                                    <span className="span-padding span-padding-left"><input type="button" className="btn btn-default" value="注册用户" /></span>
                                </div>
                                {errorMsg}
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
};
LoginView.contextTypes = {
    router: React.PropTypes.object
}
