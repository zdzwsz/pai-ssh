import { generateUUID } from '../../util/StringUtils'

export default class ConsoleView extends React.Component {

    constructor(props, context) {
        super(props, context);
        this.sockets = [];
        this.host = props.host;
        this.name = props.name;
    }

    openTerm() {
        var _this = this;
        let id = generateUUID();
        $.ajax({
            type: "POST",
            url: "/ssh/" + id,
            dataType: "json",
            data: {
                "host": _this.host
            },
            success: function (msg) {
                const status = msg.status;
                if (status == true) {
                    _this.initTerm(id);
                    _this.addSelectOption(id, _this.name + ":" + id.substring(0, 8));
                } else {
                    console.log("err for open term!");
                    toastr.error("打开终端失败！");
                }
            },
            error: function (err) {
                console.log(err);
            }
        });
    }

    addSelectOption(value, text) {
        $("#termName").append("<option value='" + value + "'>" + text + "</option>");
        this.showTerm(value);
    }

    showTerm(value) {
        $("#termName option").map(function () {
            let op = $(this).val();
            if (op == value) {
                $("#" + op).show();
                $("#termName").val(value);
            } else {
                $("#" + op).hide();
            }
        });
    }

    onChangeSelectTerm() {
        let value = $("#termName").val();
        this.showTerm(value);
    }

    deleteSelectOption(value) {
        $("#termName option[value='" + value + "']").remove();
    }

    initTerm(name) {
        var _this = this;
        let socket = io("/" + name);
        this.sockets[name] = socket;
        var terminalContainer = document.getElementById('terminal-container');
        var term = new Terminal({
            cols: 120,
            rows: 80,
            cursorBlink: true,
            scrollback: 100,
            tabStopWidth: 4,
            cursorStyle: 'underline',
        })
        term.open(terminalContainer, true);
        term.element.id = name;
        term.fit();
        $("#terminal-container").resize(function () {
            term.fit();
        });
        socket.on('sshdata', function (msg) {
            term.write(msg);
        });
        socket.emit('connectionssh');
        term.on('data', function (data) {
            socket.emit('sshdata', data);
        });
        socket.on('disconnect', function (msg) {
            term.destroy();
            socket.close();
            $("#termName option[value='" + name + "']").remove();
            _this.timeout = "";
            _this.setState(_this.state);
        });
        socket.on('timeout', function (msg) {
            console.log("msg:" + msg);
            toastr.warning(Math.round(msg/1000)+"秒","控制终端("+name.substring(0, 8)+")倒计时：");
        });
    }

    closeTerm() {
        let value = $("#termName").val();
        let lastValue = null;
        for (let id in this.sockets) {
            //console.log(id+"|"+value);
            if (id == value) {
                this.stopTerm(this.sockets[id]);
                this.deleteSelectOption(value);
            } else {
                lastValue = id;
            }
        }
        if (lastValue) {
            this.showTerm(lastValue);
        }
    }

    stopTerm(socket) {
        socket.emit('closeTerm');
    }

    componentWillUnmount() {
        for (let id in this.sockets) {
            this.stopTerm(this.sockets[id]);
        }
    }

    render() {
        
        return (
            <div>
                <div>
                    <div className="btn-toolbar toolbar" style={{ padding: 8 }}>
                        <div className="btn-group toolbar" >
                            <select onChange={this.onChangeSelectTerm.bind(this)} id="termName" className="form-control" style={{ width: 200 }}>
                            </select>
                        </div>
                        <div className="btn-group toolbar">
                            <button onClick={this.openTerm.bind(this)} type="button" className="btn btn-default">打开终端</button>
                            <button onClick={this.closeTerm.bind(this)} type="button" className="btn btn-default">关闭终端</button>
                        </div>
                    </div>
                </div>
                <div className="panel panel-default">
                    <div id="terminal-container" className="terminal-container" ></div>
                </div>
            </div>
        )
    }
}