export default class ModalView extends React.Component {
  constructor(props, context) {
    super(props, context);

  }


  componentDidMount() {

  }

  componentWillReceiveProps(nextProps) {

  }

  componentWillUnmount() {

  }

  render() {
    return (
      <div className="modal fade" tabindex="-1" role="dialog" id={this.props.id}>
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header modalstyle-header">
              <h4 className="modal-title"><i className={this.props.icon}></i>{this.props.title}</h4>
            </div>
            <div className="modal-body modalstyle-body">
           {this.props.children}
            </div>
            <div className="modal-footer modalstyle-footer">
              <button type="button" className="btn btn-default">保存</button>
              <button type="button" className="btn btn-default" data-dismiss="modal">关闭</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}


