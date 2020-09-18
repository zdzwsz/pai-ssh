
import Tabs from './TabsView';
import ResToolBar from './ResToolBarView';
import Store from './EditorStore'
import { text } from 'body-parser';
var Redirect = ReactRouterDOM.Redirect;
export default class EditorView extends React.Component {

    constructor(props, context) {
        super(props, context);
        this.sshConfig = {
            host: null
        }
        this.state = {
            treeValue: {},
            treeData: {},
            codeData: [],
            tabIndex: { "value": 0 },
            height: 380,
            sshnolink: false
        }
        this.queryParameter(props);
        this.read = this.read.bind(this);
        this.socket = io();
        this.currentEditor = { "editor": null };
        this.store = new Store(this);
        this.reflash = this.reflash.bind(this);
        this.saveFileCode = this.saveFileCode.bind(this);

        this.statusCode = 0;

    }

    queryParameter(props) {
        let { location } = props;
        if (location.state) {
            this.sshConfig.host = location.state.id;
            this.sshName = location.state.name;
        }
    }

    read(fileName, filePath) {
        var i = this.contain(fileName, filePath);
        if (i == -1) {
            this.store.loadFileCode(filePath, fileName);
        } else {
            this.state.tabIndex.value = i;
            this.setState(this.state);
        }

    }

    saveFileCode(path, name, code) {
        this.store.saveFileCode(path, name, code);
    }

    contain(fileName, filePath) {
        for (var i = 0; i < this.state.codeData.length; i++) {
            if (this.state.codeData[i].path == filePath && this.state.codeData[i].name == fileName) {
                return i;
            }
        }
        return -1;
    }

    reflash() {
        if (this.sshConfig.host) {
            this.store.loadProject(this.sshConfig.host);
        }
    }

    componentDidMount() {
        if (this.sshConfig.host) {
            this.store.loadProject();
        }
    }

    openResTool() {
        if (this.statusCode == 0) {
            $("#restoolbar").hide(300, function () {
                $("#arrowleft").removeClass("fa-arrow-left").addClass("fa-arrow-right");
                $("#tabs").removeClass("col-md-9").addClass("col-md-12");
            });
            this.statusCode = 1;
        } else {
            $("#restoolbar").show(0, function () {
                $("#tabs").removeClass("col-md-12").addClass("col-md-9");
                $("#arrowleft").removeClass("fa-arrow-right").addClass("fa-arrow-left");
            });
            this.statusCode = 0;
        }
    }

    render() {
        if (this.state.sshnolink) {
            return (
                <Redirect to={'/Home/manager'} />
            )
        }
        if (this.state.treeData["name"] == null) {
            return (
                <div style={{"text-align":"center","padding-top": "150px"}}>
                    <i className="fa fa-spinner fa-pulse fa-5x fa-fw"></i>
                    <span className="sr-only">Loading...</span>
                </div>
            )
        }else{
            return (
                <div>
                    <div className="btn-group toolbar no-rolling1">
                        <button title="展开/收缩" onClick={this.openResTool.bind(this)} type="button" className="btn btn-default btn-sm"><span className="fa fa-arrow-left" id="arrowleft"> </span></button>
                    </div>
                    <div className="panel panel-default col-md-3 ide-floder" id="restoolbar">
                        <div>
                            <ResToolBar reflash={this.reflash} id={this.sshConfig.host} name={this.sshName} socket={this.socket} data={this.state.treeData} action={this.read} selectValue={this.state.treeValue} />
                        </div>
                    </div>
                    <div className="col-md-9" id="tabs">
                        <Tabs host={this.sshConfig.host} socket={this.socket} name={this.sshName} saveFileAction={this.saveFileCode} codeData={this.state.codeData} tabIndex={this.state.tabIndex} currentEditor={this.currentEditor} onDeleteTab={this.onDeleteTab} />
                    </div>
                </div>
            )
        }
    }
}