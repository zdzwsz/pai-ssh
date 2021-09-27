import { generateUUID } from '../../util/StringUtils'

import { Terminal } from './xterm';

export default class ConsoleView extends React.Component {

    constructor(props, context) {
        super(props, context);
        this.sockets = [];
        this.host = props.host;
        this.name = props.name;
        this.opt = {
            rows: 40,
            cols: 80,
            theme: {
                "background":"rgba(25,25,25,0.5)"
            },
            fontSize: 15,
            lineHeight: 1.1,
            windowsMode: true,
            scrollback: 100,
            allowTransparency: true
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

    calculateTermRowsAndCols() {
        this.opt.rows = Math.floor(document.querySelector(".terminal-container").offsetHeight / 18);
        this.opt.cols = Math.floor((document.querySelector(".terminal-container").offsetWidth - 20) / 9);
        //console.log(document.querySelector(".terminal-container").offsetHeight,rows);
    }

    setTermRowsAndCols(socket, key) {
        socket.emit(key, { rows: this.opt.rows, cols: this.opt.cols });
    }

    fit(term) {
        if (!term) return;
        if (term._core._renderService.dimensions.actualCellWidth === 0 || term._core._renderService.dimensions.actualCellHeight === 0) return;
        this.opt.rows = Math.floor((document.querySelector(".terminal-container").offsetHeight - 10) / term._core._renderService.dimensions.actualCellHeight);
        this.opt.cols = Math.floor((document.querySelector(".terminal-container").offsetWidth - 20) / term._core._renderService.dimensions.actualCellWidth);
        term.resize(this.opt.cols, this.opt.rows);
    }

    createPopMenu(term) {
        if (typeof (ipcRenderer) != "undefined") {
            let _this = this;
            var menu = new BootstrapMenu('#' + term.element.id, {
                actionsGroups: [
                    ['clear'],
                    ['select']
                ],
                actions: {
                    copy: {
                        name: '复制',
                        iconClass: "fa fa-copy",
                        onClick: function () {
                            ipcRenderer.send('clipboard.write', term.getSelection());
                        }
                    },
                    paste: {
                        name: '粘贴',
                        iconClass: "fa fa-paste",
                        onClick: function () {
                            ipcRenderer.invoke('clipboard.read').then((text) => {
                                term.socket.emit('sshdata', text);
                                term.focus();
                            });
                        }
                    },
                    clear: {
                        name: '清除',
                        iconClass: "fa fa-recycle",
                        onClick: function () {
                            term.clear();
                            term.focus();
                        }
                    },
                    select: {
                        name: '全选',
                        iconClass: "fa fa-check-square",
                        onClick: function () {
                            term.selectAll();
                        }
                    }
                }
            });
        }
    }

    initTerm(name) {
        var _this = this;
        var command_prefix = "";
        var command = "";
        var command_start = false;
        var command_model = 0;
        let socket = io("/" + name);
        this.sockets[name] = socket;
        this.calculateTermRowsAndCols();
        var term = new Terminal(this.opt);
        let terminalContainer = document.getElementById('terminal-container');
        term.open(terminalContainer, true);
        term.element.id = name;
        term.socket = socket;
        this.fit(term);
        this.setTermRowsAndCols(socket, "init");//准备
        this.createPopMenu(term)
        socket.on("init-over", function () {
            socket.emit('connectionssh'); //正式连接
        })
        term.onData(function (data) {
            socket.emit('sshdata', data);
        });
        term.onKey(function (data) {
            command_start = true;
            if (command_prefix.length == 0) {
                var buffer = term.buffer.normal;
                command_prefix = buffer.getLine(buffer.cursorY + buffer.baseY).translateToString(true);
            }
            if (command_model == 1 && data.key && data.key.charCodeAt(0) == 27) {
                if ($("#promptPanel").css('display') != 'none' && $("#promptPanel").css('top') == "50px") {
                    $("#promptPanel").css({ "top": "-86px", "height": "178px" });
                    socket.emit('prompt_specific', command);
                } else {
                    $("#promptPanel").css({ "top": "50px", "height": "42px" });
                    $("#promptContext").html("");
                }
            }
        })
        term.onLineFeed(function () {
            setTimeout(function () {
                //console.log("modes:"+term.modes)
                var buffer = term.buffer.normal;
                command_prefix = buffer.getLine(buffer.cursorY + buffer.baseY).translateToString(true);
                $("#promptPanel").hide();
                //let theCanvas = document.getElementsByTagName('canvas');
                //for(let i =0;i<theCanvas.length;i++){
                //    let context = theCanvas[i].getContext('2d');
                //    context.fillStyle = 'rgba(255, 255, 255, 0)';
                //}
            }, 500)
        })

        term.focus();
        term.onResize(function () { });

        socket.on('sshdata', function (msg) {
            if (typeof msg === 'string') {
                term.write(msg)
            } else {
                msg = new Uint8Array(msg)
                term.write(msg)
            }
            if (command_start) {
                setTimeout(function () {
                    var buffer = term.buffer.normal;
                    var command_str = buffer.getLine(buffer.cursorY + buffer.baseY).translateToString(true);
                    command = command_str.substring(command_prefix.length);
                    command = command.replace(/^\s*|\s*$/g, "");
                    //console.log("cmd:" + command + "\nstr:" + command_str + "\npre:"+ command_prefix.length+"\nbaseY:"+buffer.baseY);
                    socket.emit('prompt', command);
                }, 100)
            }

        });
        socket.on('disconnect', function (msg) {
            term.dispose();
            socket.close();
            $("#termName option[value='" + name + "']").remove();
            _this.timeout = "";
            _this.setState(_this.state);
            $("#promptPanel").hide();
            command_model = 0;
        });
        socket.on('timeout', function (msg) {
            console.log("msg:" + msg);
            toastr.warning(Math.round(msg / 1000) + "秒", "控制终端(" + name.substring(0, 8) + ")倒计时：");
        });

        socket.on('prompt', function (msg) {
            if (msg && msg == "close") {
                $("#promptPanel").hide();
            }
            else if (msg.length > 0) {
                let code = msg.substring(0, 1);
                if (code == ":") {
                    $("#promptTitle").html(msg.substring(1))
                    $("#promptPanel").show();
                    command_model = 1;
                } else {
                    $("#promptTitle").html(msg)
                    $("#promptPanel").css({ "top": "50px", "height": "42px" }).show();
                    $("#promptContext").html("");
                    command_model = 0;
                }

            }
            else {
                $("#promptPanel").hide();
            }
        });
        socket.on('prompt_specific', function (msg) {
            let msgArray = msg.split("<br>")
            let msgStrs = ["", ""]
            let styles = ["prompt_white", "prompt_white", "prompt_black", "prompt_black"]
            for (let i = 0; i < 10; i++) {
                if (msgArray.length > i) {
                    msgStrs[i % 2] += "<p id='" + styles[i % 4] + "'>" + msgArray[i] + "</p>";
                } else {
                    msgStrs[i % 2] += "<p id='" + styles[i % 4] + "'>&nbsp</p>";
                }

            }
            $("#promptContext_left").html(msgStrs[0])
            $("#promptContext_right").html(msgStrs[1])
        })


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
                    <div className="btn-toolbar toolbar" style={{ padding: "9px 0px 10px 0px" }}>
                        <div className="btn-group toolbar">
                            <select onChange={this.onChangeSelectTerm.bind(this)} id="termName" className="form-control" style={{ width: 200 }}>
                            </select>
                        </div>
                        <div className="btn-group toolbar">
                            <button onClick={this.openTerm.bind(this)} type="button" className="btn btn-default">打开终端</button>
                            <button onClick={this.closeTerm.bind(this)} type="button" className="btn btn-default">关闭终端</button>
                        </div>
                    </div>
                    <div>
                        <div id="promptPanel">
                            <div id="promptTitle"></div>
                            <div className="row">
                                <div className="col-md-6" id="promptContext_left"></div>
                                <div className="col-md-6" id="promptContext_right"></div>
                            </div>
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