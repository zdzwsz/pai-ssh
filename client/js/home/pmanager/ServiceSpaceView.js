import AloneSpace from './AloneSpaceView';
export default class ServiceSpaceView extends React.Component {

    static contextTypes = {
        router: React.PropTypes.object.isRequired
    }

    constructor(props, context) {
        super(props, context);
        this.state = this.props.data;
    }


    render() {
        return (
            <div className="panel panel-default">
                <div className="panel-heading">
                    <h3 className="panel-title">
                        {this.state.title}
                    </h3>
                </div>
                <div className="panel-body">
                    {
                        this.state.group.map((entry, index) => (
                            <AloneSpace title = {this.state.title} data = {entry} status = "view" onSaveSpace={this.props.onSaveSpace} onDeleteSpace={this.props.onDeleteSpace} />
                        ))
                    }
                    <AloneSpace title = {this.state.title} status = "add" onSaveSpace={this.props.onSaveSpace} onDeleteSpace={this.props.onDeleteSpace} />
                </div>
            </div>
        )
    }
}