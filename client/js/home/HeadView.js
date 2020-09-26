var Link = ReactRouterDOM.Link;
export default class HeadView extends React.Component {

    constructor(props, context) {
        super(props, context);
        this.user = JSON.parse(sessionStorage.getItem("user"));
    }

    componentDidMount() {
    }

    openDebugDevTools() {
        openDevTools();
    }

    render() {
        return (
            <div style={{ "padding": 8 }}>
                <div className="ide-user" >
                    <Link id="user_logout" to="/" title="重新登陆"><span className="fa fa-user span-padding"></span><span className="span-padding-right">{this.user.username} </span></Link>
                    <Link to="/Home/manager" title="返回"><span className="fa fa-th span-padding"></span><span className="span-padding">地址配置</span> </Link>
                    <span onClick={this.openDebugDevTools.bind(this)} style={{"cursor":"pointer"}}><span className="fa fa-cogs span-padding"></span><span>调试</span></span>
                </div>
            </div>
        )
    }
}