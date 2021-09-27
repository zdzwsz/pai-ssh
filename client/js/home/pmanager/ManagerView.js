import ServiceSpace from './ServiceSpaceView';
import Store from './ManagerStore';
export default class ManagerView extends React.Component {
    constructor(props) {
        super(props);
        this.store = new Store(this);
        this.onSaveSpace = this.onSaveSpace.bind(this);
        this.onDeleteSpace = this.onDeleteSpace.bind(this);
        this.onUpdateSpace = this.onUpdateSpace.bind(this);
        this.state={};
        
    }

    onSaveSpace(data){
      this.store.saveAloneSpace(data);
    }

    onDeleteSpace(title,id){
      this.store.deleteSpace(title,id);
    }

    onUpdateSpace(){
        this.store.updateSpace();
      }

    componentWillMount(){
       this.store.loadServiceSpace();
    }

    render() {
        return (
            <div className="container">
                {
                    this.state.serviceSpace?
                    this.state.serviceSpace.map((entry, index) => (
                    <ServiceSpace key={entry._id} data={entry} onSaveSpace={this.onSaveSpace} onDeleteSpace={this.onDeleteSpace} onUpdateSpace={this.onUpdateSpace} /> ))
                    :""
                }
            </div>
        )
    }

}