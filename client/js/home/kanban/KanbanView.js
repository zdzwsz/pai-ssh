export default class KabbanView extends React.Component {

    constructor(props, context) {
        super(props, context);
    }

    render() {
        return (
            <div className="kanban-info">
                <div className="alert alert-success alert-dismissable">
                    成功1！很好地完成了提交。
                    <button type="button" className="close" data-dismiss="alert"
                        aria-hidden="true">&times;</button>
                    
                </div>
                <div className="alert alert-info alert-dismissable">
                    信息1！请注意这个信息。
                    <button type="button" className="close" data-dismiss="alert"
                        aria-hidden="true">&times;</button>
                    
                </div>
                <div className="alert alert-warning alert-dismissable">
                警告1！请不要提交。
                    <button type="button" className="close" data-dismiss="alert"
                        aria-hidden="true"> &times;</button>
                    
                </div>
                <div className="alert alert-danger alert-dismissable">
                错误1！请进行一些更改。
                    <button type="button" className="close" data-dismiss="alert"
                        aria-hidden="true">&times;</button>
                </div>
            </div>
        )
    }
}