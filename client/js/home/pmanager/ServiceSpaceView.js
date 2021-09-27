import AloneSpace from './AloneSpaceView';
export default class ServiceSpaceView extends React.Component {

    static contextTypes = {
        router: React.PropTypes.object.isRequired
    }

    constructor(props, context) {
        super(props, context);
        this.state = this.props.data;
        this.type = "所有";
        this.type_css = []
    }

    componentWillReceiveProps(nextProps) {
        this.state = nextProps.data;
    }


    onTypeClick(type) {
        this.type = type;
        this.setState({
            state: this.state
        });
    }

    setCss() {
        let b_css = ["btn btn-default button-active", "btn btn-default button-inactivity"];
        let active = 0;
        this.type_css = []
        if (this.type == "所有") active = 0;
        else if (this.type == "生产") active = 1;
        else if (this.type == "测试") active = 2;
        else if (this.type == "研发") active = 3;
        else active = 4;
        for (let i = 0; i < 5; i++) {
            this.type_css.push(b_css[active == i ? 0 : 1]);
        }
    }

    render() {
        this.setCss();
        return (
            <div className="panel panel-default space-container">
                <div className="selt_title">
                    <h4>
                        服务器管理
                    </h4>
                </div>
                <div className="btn-group toolbar">
                    <button onClick={this.onTypeClick.bind(this, "所有")} type="button" className={this.type_css[0]}>所有环境<span className="badge-background badge">{this.state.type[4]}</span></button>
                    <button onClick={this.onTypeClick.bind(this, "生产")} type="button" className={this.type_css[1]}>生产环境<span className="badge-background badge">{this.state.type[0]}</span></button>
                    <button onClick={this.onTypeClick.bind(this, "测试")} type="button" className={this.type_css[2]}>测试环境<span className="badge-background badge">{this.state.type[1]}</span></button>
                    <button onClick={this.onTypeClick.bind(this, "研发")} type="button" className={this.type_css[3]}>研发环境<span className="badge-background badge">{this.state.type[2]}</span></button>
                    <button onClick={this.onTypeClick.bind(this, "其他")} type="button" className={this.type_css[4]}>其他环境<span className="badge-background badge">{this.state.type[3]}</span></button>
                </div>
                <div className="panel-body alone-space">
                    {
                        this.state.group.map((entry, index) => (
                            <AloneSpace type={this.type} title={this.state.title} data={entry} status="view" onSaveSpace={this.props.onSaveSpace} onDeleteSpace={this.props.onDeleteSpace} onUpdateSpace={this.props.onUpdateSpace} />
                        ))
                    }
                    <AloneSpace title={this.state.title} status="add" onSaveSpace={this.props.onSaveSpace} onDeleteSpace={this.props.onDeleteSpace} />
                </div>
            </div>
        )
    }
}