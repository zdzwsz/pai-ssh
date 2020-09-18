import EditorToolBar from './EditorToolBarView';
export default class TabPanelView extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.index = this.props.index;
        this.tabIndex = this.props.tabIndex;
        this.code = this.props.codeData.code;
        this.fileName = this.props.codeData.name;
        this.path = this.props.codeData.path;
        this.getEditor = this.getEditor.bind(this);
        this.saveFileContent = this.saveFileContent.bind(this);
        this.type = [];
        this.type["js"] = "javascript";
        this.type["htm"] = "html";
        this.type["html"] = "html";
        this.type["java"] = "java";
        this.type["py"] = "python";
        this.type["json"] = "json";
        this.type["xml"] = "xml";
        this.type["go"] = "go";
        this.language = this.getLanguage();
    }

    getLanguage() {
        let language = "txt";
        if (this.fileName) {
            let i = this.fileName.lastIndexOf(".");
            if (i > 0) {
                language = this.fileName.substring(i + 1);
                console.log(this.type[language]);
                if (this.type[language]) {
                    language = this.type[language];
                }else{
                    language = "txt"
                }
            }
        }
        return language;
    }

    componentDidMount() {
        this.setValue();
    }

    componentDidUpdate() {
       // this.setValue();
    }

    setValue() {
        var _this = this;
        window.setTimeout(function () {
            if (_this.refs.codeFrame.contentWindow && _this.refs.codeFrame.contentWindow.editor != null) {
                let editor = _this.refs.codeFrame.contentWindow.editor;
                let monaco_editor = _this.refs.codeFrame.contentWindow.monaco_editor;
                var langModel = monaco_editor.createModel(_this.code, _this.language);
                editor.setModel(langModel);
                editor.onDidBlurEditorText(function () {
                    _this.props.codeData.code = editor.getValue();
                });
                editor.onKeyDown(function (e) {
                    if (e.ctrlKey && e.keyCode == 49) {
                        _this.saveFileContent()
                        e.preventDefault();
                        e.stopPropagation();
                    }

                })
            } else {
                _this.setValue();
            }
        }, 500);
    }

    saveFileContent(){
      console.log(this.index+"|"+this.tabIndex.value);
      if(this.index == this.tabIndex.value){
        if(this.props.saveFileAction){
            this.props.saveFileAction(this.path,this.fileName,this.getEditor().getValue());
        }
      }
    }

    componentWillReceiveProps(nextProps) {
        this.index = nextProps.index;
        this.tabIndex = nextProps.tabIndex;
        this.code = nextProps.codeData.code;
        this.fileName = nextProps.codeData.name;
        this.language = this.getLanguage();
    }

    getEditor() {
        return this.refs.codeFrame.contentWindow.editor;
    }


    render() {
        let tab = "tab" + this.index;
        let className = "tab-pane fade";

        let iframeSrc = "language/" + this.language + ".html";
        return (
            <div className={className} id={tab}>
                <EditorToolBar getEditor ={this.getEditor} saveFileAction={this.saveFileContent} />
                <iframe src={iframeSrc} ref="codeFrame" id="myiframe" className="editor-frame" scrolling="no"></iframe>
            </div>
        )
    }
}