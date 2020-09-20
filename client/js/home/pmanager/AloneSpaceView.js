import Store from './AloneSpaceStore';
export default class AloneSpaceView extends React.Component {

    static contextTypes = {
        router: React.PropTypes.object.isRequired
    }

    constructor(props, context) {
        super(props, context);
        this.state = {};
        this.state.data = this.props.data;
        this.state.status = this.props.status;
        this.title = this.props.title;
        this.action = null;
        this.store = new Store(this);
    }

    openServiceSpace(id,name) {
        var { history } = this.context.router;
        const location = {
            pathname: '/Home/editor',
            state: { id: id,name:name }
        }
        history.replace(location);
    }

    newSpace(e) {
        this.canelAction("new");
    }

    canelSaveSpace(e) {
        this.canelAction("add");
    }

    canelAction(action) {
        this.state.status = action;
        this.setState(this.state);
    }

    saveSpace(e) {
        var data = {};
        data.team = "free";
        data.name = this.refs.name.value;
        data.host = this.refs.host.value;
        data.port = this.refs.port.value;
        data.username = this.refs.username.value;
        data.password = this.refs.password.value;
        data.title = this.title;
        data.path = this.refs.path.value;
        if (this.props.onSaveSpace) {
            this.props.onSaveSpace(data);
        }
        this.canelSaveSpace(e);
    }

    delete4Auth(e) {
        this.state.status = "auth";
        this.action = "DELETE";
        this.setState(this.state);
    }

    modify4Auth(e) {
        this.state.status = "auth";
        this.action = "MODIFY";
        this.setState(this.state);
    }

    validOwn(e) {
        //var username = this.refs.username.value;
        //var password = this.refs.password.value;
        var _this = this;
        this.store.validOwn(function (value) {
            if (_this.action == "MODIFY") {
                _this.state.status = "edit";
                _this.action = "MODIFY";
                _this.setState(_this.state);
            } else if(_this.action == "DELETE") {
                _this.state.status = "view";
                _this.setState(_this.state);
               _this.store.deleteSpace(_this.state.data.title,_this.state.data._id);
            }
        });
    }

    saveModify(e) {
        var data = this.state.data;
        data.name = this.refs.name.value;
        data.username = this.refs.username.value;
        data.password = this.refs.password.value;
        data.path = this.refs.path.value;
        this.store.updateSpace(data);
    }

    componentDidMount() {
        $(function () { $("[data-toggle='tooltip']").tooltip(); });
    }
    

    render() {
        $(".downloadcss").show();
        var entry = this.state.data;
        if (this.state.status == "view") {
            //console.log(entry._id);
            if(entry._id == "delete"){
                return(
                    <div></div>
                );
            }
            return (
                <div key={entry._id} id={entry._id} className="col-sm-6 col-md-3 col-lg-3" >
                    <div className="thumbnail" style={{ "height": "240px" }}>
                        <div className="manager-title text-center">
                            <h4 onClick={this.openServiceSpace.bind(this, entry._id,entry.name)}><span className="fa fa-server span-padding"></span>{entry.name}</h4>
                            <span title="修改空间配置" onClick={this.modify4Auth.bind(this)} className="glyphicon glyphicon-pencil span-padding"></span>
                            <span className="span-padding"></span>
                            <span title="删除空间配置" onClick={this.delete4Auth.bind(this)} className="glyphicon glyphicon-trash"></span>
                        </div>
                        <div className="manager-detail" style={{ "padding-top": 8 }}>服务地址：{entry.host}</div>
                        <div className="manager-detail">所属团队：{entry.team}</div>
                        <div className="manager-detail">创建人员：{entry.own}</div>
                        <div className="manager-detail">创建时间：{entry.sdate}</div>
                        <div className="manager-detail">工作目录：{entry.path}</div>
                    </div>
                </div>
            )
        } else if (this.state.status == "add") {
            return (
                <div className="col-sm-6 col-md-3 col-lg-3">
                    <div className="thumbnail" style={{ "height": "240px" }}>
                        <div className="manager-title text-center" onClick={this.newSpace.bind(this)}>
                            <h4><span className="glyphicon glyphicon-th"></span></h4>
                            <h4><span>新增服务地址</span></h4>
                        </div>
                        <div className="caption text-center" onClick={this.newSpace.bind(this)}> <h1><span className="glyphicon glyphicon-plus"></span></h1></div>
                    </div>
                </div>
            )
        } else if (this.state.status == "new") {
            var entry = {};
            entry.port=22;
            entry.path="/root/";
            entry.username="root";
            return (
                <div  className="col-sm-6 col-md-3 col-lg-3">
                    <div className="thumbnail text-center" style={{ "height": "240px", "padding": "6px" }}>
                        <div className="input-group input-group-sm" style={{ "padding-top": "2px" }}>
                            <span className="input-group-addon">名称</span>
                            <input type="text" ref="name" className="form-control" placeholder="服务名称" />
                        </div>
                        <div className="input-group input-group-sm" style={{ "padding-top": "2px" }}>
                            <span className="input-group-addon">地址</span>
                            <input type="text" ref="host" className="form-control" placeholder="地址（IP）" />
                            <input type="text" ref="port" className="form-control" placeholder="port" defaultValue={entry.port} />
                        </div>
                        <div className="input-group input-group-sm" style={{ "padding-top": "2px" }}>
                            <span className="input-group-addon">目录</span>
                            <input type="text" ref="path" className="form-control" placeholder="目录:/home/" defaultValue={entry.path} />
                        </div>
                        <div className="input-group input-group-sm" style={{ "padding-top": "2px" }}>
                            <span className="input-group-addon">用户</span>
                            <input type="text" ref="username" className="form-control" placeholder="username" defaultValue={entry.username} />
                            <input type="password" ref="password" className="form-control" placeholder="password" />
                        </div>
                        <div className="form-group" style={{ "padding": "2px" }}>
                            <input type="button" className="btn btn-default" value="保存" onClick={this.saveSpace.bind(this)} />&emsp;
                            <input type="button" className="btn btn-default" value="取消" onClick={this.canelSaveSpace.bind(this)} />
                        </div>
                    </div>
                </div>
            )

        } else if (this.state.status == "edit") {
            return (
                <div key={entry._id} id={entry._id} className="col-sm-6 col-md-3 col-lg-3">
                    <div className="thumbnail text-center" style={{ "height": "240px", "padding": "6px" }}>
                        <h4>修改资料</h4>
                        <div className="input-group input-group" style={{ "padding-top": "2px" }}>
                            <span className="input-group-addon">名称</span>
                            <input type="text" ref="name" className="form-control" defaultValue={entry.name} />
                        </div>
                        <div className="input-group input-group" style={{ "padding-top": "2px" }}>
                            <span className="input-group-addon">用户</span>
                            <input type="text" ref="username" className="form-control" defaultValue={entry.username} />
                            <input type="password" ref="password" className="form-control" defaultValue={entry.password} />
                        </div>
                        <div className="input-group input-group" style={{ "padding-top": "4px" }}>
                            <span className="input-group-addon">目录</span>
                            <input type="text" ref="path" className="form-control" defaultValue={entry.path} />
                        </div>
                        <div className="form-group" style={{ "padding": "4px" }}>
                            <input type="button" className="btn btn-default" value="保存" onClick={this.saveModify.bind(this)} />&emsp;
                            <input type="button" className="btn btn-default" value="取消" onClick={this.canelAction.bind(this, 'view')} />
                        </div>
                    </div>
                </div>
            )
        } else if (this.state.status == "auth") {
            return (
                <div className="col-sm-6 col-md-3 col-lg-3">
                    <div className="thumbnail" style={{ "height": "240px" }}>
                        <div className="manager-title text-center">
                            <h4 onClick={this.openServiceSpace.bind(this, entry._id)}><span className="glyphicon glyphicon-hdd"></span>&nbsp;{entry.name}</h4>
                        </div>
                        <div className="manager-detail text-center">
                            <h4>确定操作({this.action})</h4>
                            <div className="form-group" style={{ "padding": "4px" }}>
                                <input type="button" className="btn btn-default" value="确定" onClick={this.validOwn.bind(this)} />&emsp;
                                <input type="button" className="btn btn-default" value="取消" onClick={this.canelAction.bind(this, 'view')} />
                            </div>
                        </div>
                    </div>
                </div>
            )
        }

    }
}