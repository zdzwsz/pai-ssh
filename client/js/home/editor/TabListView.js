export default class TabListView extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.index = this.props.index;
        this.name = this.props.codeData.name;
        this.onOver = this.onOver.bind(this);
        this.onOut = this.onOut.bind(this);
        this.onDeleteTab = this.onDeleteTab.bind(this);
    }

    onselect(e) {
        e.preventDefault();
        this.props.onselect(this.index);
    }

    onOver(e) {
        $(e.target).addClass("tab-delete-focus");
    }

    onOut(e) {
        $(e.target).removeClass("tab-delete-focus");
    }

    onDeleteTab(e) {
        e.nativeEvent.stopImmediatePropagation();
        e.stopPropagation();
        this.props.onDeleteTab(this.index);
    }

    componentDidMount() {
        if (this.index == this.props.tabIndex.value) {
            let tab = '#editTab a[href="#tab' + this.index + '"]';
            $(tab).tab('show');
        }
    }

    componentWillReceiveProps(nextProps) {
        this.index = nextProps.index;
        this.name = nextProps.codeData.name;
        if (this.index == nextProps.tabIndex.value) {
            let tab = '#editTab a[href="#tab' + this.index + '"]';
            $(tab).tab('show');
        }
    }

    render() {
        let tab = "#tab" + this.index;
        return (
            <li onClick={this.onselect.bind(this)}>
                <a href={tab} data-toggle="tab">{this.name}
                    <span onMouseOver={this.onOver} onMouseOut={this.onOut} onClick={this.onDeleteTab} className="glyphicon glyphicon-remove tab-delete"> </span>
                </a>
            </li>
        )
    }
}