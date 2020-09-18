export default class ClanView extends React.Component {

    constructor(props, context) {
        super(props, context);
        this.socket = io('/clan');
        this.user = JSON.parse(sessionStorage.getItem("user"));
    }

    componentWillUnmount() {
        this.socket.close();
    }

    componentDidMount() {
        var _this = this;
        if (this.user) {
            let name = this.user.username
            this.socket.emit('login', this.user);
            this.socket.on('login', function (msg) {
                if (msg) {
                    let message = "I am " + msg.user.username + ", hello to all ! " + " now online:" + msg.onlineCount;
                    if (msg.user.username == name) {
                        _this.rightMessage(name, message);
                    } else {
                        _this.leftMessage(msg.user.username, message);
                    }
                }
            });
            this.socket.on('logout', function (msg) {
                if (msg) {
                    let message = msg.user.username + " say bye bye ! " + " now online:" + msg.onlineCount;
                    if (msg.user.username == name) {
                        _this.rightMessage(name, message);
                    } else {
                        _this.leftMessage(msg.user.username, message);
                    }
                }
            });

            this.socket.on('message', function (msg) {
                if (msg) {
                    let message = msg.content;
                    if (msg.username == name) {
                        _this.rightMessage(name, message);
                    } else {
                        _this.leftMessage(msg.username, message);
                    }
                }
            });


        } else {

        }
    }



    rightMessage(name, message) {
        let mo = $('<div class="receiver">').append($('<div class="author">').text(name));
        mo.append($('<div>').append($('<div class="right_triangle">'))
            .append($('<span>').text(message)));
        $('#messages').append(mo);
        $("#messages").scrollTop($("#messages").height());
    }

    leftMessage(name, message) {
        let mo = $('<div class="sender">').append($('<div class="author">').text(name));
        mo.append($('<div>').append($('<div class="left_triangle">'))
            .append($('<span>').text(message)));
        $('#messages').append(mo);
        $("#messages").scrollTop($("#messages").height());
    }

    snedMessage(e) {
        e.preventDefault();
        let content = this.refs.textMessage.value;
        if (content == null || content == "") return;
        var obj = {
            userid: this.user.userid,
            username: this.user.username,
            content: content
        };
        this.socket.emit('message', obj);
        this.refs.textMessage.value = "";
    }

    render() {
        return (
            <div>
                <div className="clan-message" id="messages">

                </div>
                <form onSubmit={this.snedMessage.bind(this)}>
                    <div className="row clan-send">
                        <div className="input-group col-md-11">
                            <input type="text" ref="textMessage" className="form-control" />
                            <span className="input-group-btn">
                                <button className="btn btn-default" type="submit"> send</button>
                            </span>
                        </div>
                    </div>
                </form>
            </div>
        )
    }
}