export default class EditorToolBarView extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.save = this.save.bind(this);
        this.fontSize = 14;
        this.fileName = this.props.fileName;
        this.path = this.props.path;
    }

     componentWillReceiveProps(nextProps) {
        this.codeData = nextProps.codeData;
    }

    undo() {
        this.getEditor().trigger("keyboard", "undo", null);
    }

    redo() {
        this.getEditor().trigger("keyboard", "redo", null);
    }

    formatDocument() {
        var action = this.getEditor().getAction("editor.action.formatDocument");
        action.run().done();
    }

    save(e) {
        e.preventDefault();
        if(this.props.saveFileAction){
            this.props.saveFileAction();
        }
    }

     getEditor() {
        return this.props.getEditor();
    }

     magnifyFont(type) {
        if (type == 0) {
            this.fontSize = this.fontSize + 2;
            if (this.fontSize > 20) this.fontSize = 20;
            this.getEditor().updateOptions({ 'fontSize': this.fontSize });
        } else {
            this.fontSize = this.fontSize - 2;
            if (this.fontSize < 10) this.fontSize = 10;
            this.getEditor().updateOptions({ 'fontSize': this.fontSize });
        }
    }


    render() {
        return (
             <div className="btn-toolbar toolbar" style={{padding:"4px 0px 5px 0px"}}>
                        <div className="btn-group toolbar">
                            <button id="editor_save" data-toggle="tooltip"  title="保存文件" type="button" onClick={this.save} className="btn btn-default btn-sm"><span className="fa fa-save"> </span></button>
                            <button data-toggle="tooltip"  title="撤销" type="button" onClick={this.undo.bind(this)} className="btn btn-default btn-sm"><span className="fa fa-undo"> </span></button>
                            <button data-toggle="tooltip"  title="恢复" type="button" onClick={this.redo.bind(this)} className="btn btn-default btn-sm"><span className="fa fa-repeat"> </span></button>
                        </div>
                        <div className="btn-group toolbar">
                            <button data-toggle="tooltip"  title="格式化"  type="button" onClick={this.formatDocument.bind(this)} className="btn btn-default btn-sm"><span className="fa fa-indent"> </span></button>
                            <button data-toggle="tooltip"  title="放大"  type="button" onClick={this.magnifyFont.bind(this, 0)} className="btn btn-default btn-sm"><span className="fa fa-plus-square-o"> </span></button>
                            <button data-toggle="tooltip"  title="缩小"  type="button" onClick={this.magnifyFont.bind(this, 1)} className="btn btn-default btn-sm"><span className="fa fa-minus-square-o"> </span></button>
                        </div>
             </div>
        )
    }

}