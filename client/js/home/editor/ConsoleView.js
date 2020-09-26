import { generateUUID } from '../../util/StringUtils'

import { Terminal } from './xterm';

export default class ConsoleView extends React.Component {

    constructor(props, context) {
        super(props, context);
        this.sockets = [];
        this.host = props.host;
        this.name = props.name;
        this.opt={
            theme:{
                //foreground: 'white', //字体
                background: '#212121' //背景色
              },
              fontSize: 15,
              lineHeight:1.1,
              //allowTransparency :true,
              windowsMode:true,
              scrollback:100
              //fontFamily:"黑体,sans-serif"
        }
  
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

    getTermRowsAndCols() {
        let rows = Math.floor(document.querySelector(".terminal-container").offsetHeight / 18);
        let cols = Math.floor(document.querySelector(".terminal-container").offsetWidth / 9.1);
        console.log(document.querySelector(".terminal-container").offsetHeight,rows);
        return { rows: rows, cols, cols }
    }

    setTermRowsAndCols(socket, key) {
        socket.emit(key, this.getTermRowsAndCols());
    }

    initTerm(name) {
        var _this = this;
        let socket = io("/" + name);
        this.sockets[name] = socket;
        let rowAndCols = this.getTermRowsAndCols();
        this.opt.rows=rowAndCols.rows;
        this.opt.cols=rowAndCols.cols;
        //opts.scrollback = 100;
        var term = new Terminal(this.opt);
        let terminalContainer = document.getElementById('terminal-container');
        term.open(terminalContainer, true);
        term.element.id = name;

        this.setTermRowsAndCols(socket, "init");//准备
        socket.on("init-over", function () {
            socket.emit('connectionssh'); //正式连接
        })
        term.onData(function (data) {
            //console.log(data);
            socket.emit('sshdata', data);
        });

        term.focus();

        term.onResize(function () {

        });

        socket.on('sshdata', function (msg) {
            if (typeof msg === 'string') {
                return term.write(msg)
            }else{
                msg = new Uint8Array(msg)
                term.write(msg)
            }
        });
        socket.on('disconnect', function (msg) {
            term.dispose();
            socket.close();
            $("#termName option[value='" + name + "']").remove();
            _this.timeout = "";
            _this.setState(_this.state);
        });
        socket.on('timeout', function (msg) {
            console.log("msg:" + msg);
            toastr.warning(Math.round(msg / 1000) + "秒", "控制终端(" + name.substring(0, 8) + ")倒计时：");
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