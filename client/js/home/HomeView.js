import Head from './HeadView';
import Manager from './pmanager/ManagerView';
import Editor from './editor/EditorView';
var Link = ReactRouterDOM.Link;
var Route = ReactRouterDOM.Route;


export default class HomeView extends React.Component {
    static contextTypes = {
        router: React.PropTypes.object.isRequired
    }
    constructor(props, context) {
        super(props, context);
        var token = $.cookie('token');
        this.setTokenTimeOut(token);
    }

    setTokenTimeOut(token) {
        var token_ = $.base64.decode(token);
        var strValues = token_.split(".");
        var time = strValues[0];
        var name = strValues[1];
        //console.log(time+"|"+name);
        var _this = this;
        setTimeout(function () {
            $.ajax({
                type: "POST",
                url: "/token",
                dataType: "json",
                data: {
                    "name": name,
                    "token": token
                },
                success: function (msg) {
                    const status = msg.status;
                    if (status == true) {
                        let token = msg.token
                        $.cookie('token', token);
                        _this.setTokenTimeOut(token)
                        console.log("token is change!");
                    }
                },
                error: function (err) {
                    console.log(err);
                }
            });
        }, (Number.parseInt(time) - 30 * 1000));
    }

    componentDidMount() {
        var { history } = this.context.router;
        history.push('/Home/manager');
    }

    render() {
        return (
            <div>
                <Head />
                <Route exact path='/Home/editor' component={Editor} />
                <Route path="/Home/manager" component={Manager} />
            </div>
        )
    }
}

