import TabList from './TabListView';
import TabPanel from './TabPanelView';
import Console from './ConsoleView';
export default class TabsView extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.index = 0;
        //this.codeData = this.props.codeData;
        this.onDeleteTab = this.onDeleteTab.bind(this);
        this.state = {
            tabIndex: this.props.tabIndex,
            codeData: this.props.codeData
        }
        this.onselect = this.onselect.bind(this);
    }

    onselect(index) {
        this.state.tabIndex.value = index;
        this.setState(this.state);
    }

    onDeleteTab(index) {
        this.state.codeData.splice(index, 1);
        if (this.state.codeData.length == 0) {
            this.state.tabIndex.value = -1;
            $('#editTab a[href="#tab_home"]').tab('show');
        } else {
            this.state.tabIndex.value = 0;
        }
        this.setState(this.state);
    }

    componentWillReceiveProps(nextProps) {
        this.state = {
            tabIndex: nextProps.tabIndex,
            codeData: nextProps.codeData
        }
        this.setState(this.state);
    }

    render() {
        return (
            <div>
                <ul id="editTab" className="nav nav-tabs">
                    <li className="active" >
                        <a href="#tab_home" data-toggle="tab">SSH控制台</a>
                    </li>
                    {this.state.codeData.map((entry, index) => (
                        <TabList codeData={entry}
                            index={index}
                            tabIndex={this.state.tabIndex}
                            onselect={this.onselect}
                            onDeleteTab={this.onDeleteTab}
                        />
                    ))}
                </ul>
                <div className="tab-content editor-tab-content">
                    <div className="tab-pane fade in active" id="tab_home">
                        <Console host={this.props.host} socket={this.props.socket} name={this.props.name} />
                    </div>
                    {this.state.codeData.map((entry, index) => (
                        <TabPanel
                            codeData={entry}
                            index={index}
                            tabIndex={this.state.tabIndex}
                            saveFileAction={this.props.saveFileAction}
                            />
                    ))}
                </div>
            </div>
        )
    }
}