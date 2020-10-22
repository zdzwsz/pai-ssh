
var openFileType = ["js","ts","txt","yaml","html","htm","xml","xhtml","java","py","drl","c","php","ini","properties","md","vue","jsp","json","css","sh","bat"];
function isOpenFileType(fileName){
    if(fileName== null)return false;
    let i = fileName.lastIndexOf(".");
    if(i<0)return false;
    let extension = fileName.substring(i+1);
    console.log("extension:"+extension);
    if(extension == "") return false;
    for (const filetype of openFileType) {
        if(filetype === extension) {
            return true;
        }
    }
    return false;
}

import getFileCss from "./FileTypeCss"
export default class TreeView extends React.Component {

    constructor(props, context) {
        super(props, context);
        this.state = {
            data: this.props.data
        };
       // console.log(this.state.data);
        this.action = this.props.action;
        this.selectValue = this.props.selectValue;
        this.onListDir = this.props.onListDir;
        this.onOver = this.onOver.bind(this);
        this.onOut = this.onOut.bind(this);
        //this.reNameSub = this.reNameSub.bind(this);
        this.selectItem = this.props.selectItem;
        if (!this.selectItem) {
            this.selectItem = { "e": null }
        }
        this.layer = this.props.layer;
        if (!this.layer) {
            this.layer = 0;
        }

    }



    isSub() {
        return this.state.data.sub ? true : false;
    }

    onItemclick(e) {
        //e.preventDefault();
        this.onSelect(e);
        if (e.button == 0) {
            if (this.isSub()) {
                this.openFolder();
            } 
        }
    }
    onDoubleClick(e){
        if (!this.isSub()) {
            if(isOpenFileType(this.state.data.name)){
                this.openFile()
            }else{
                toastr.info(name + "不支持在线打开，请下载打开文件");
            }
            
        }
    }

    openFolder() {
        this.state.data.open = !this.state.data.open;
        //console.log(this.state.data.path);
        this.onListDir(this.state.data.path,this.state.data);
        this.setState({
            data: this.state.data
        });
    }

    openFile() {
        if (this.action) {
            this.action(this.state.data.name, this.state.data.path);
        }
    }

    onOver(e) {
        let t = e.target;
        if (e.target.tagName != "DIV")
            t = e.target.parentNode;
        $(t).addClass("tree-item");
    }

    onOut(e) {
        let t = e.target;
        if (e.target.tagName != "DIV")
            t = e.target.parentNode;
        $(t).removeClass("tree-item");
    }

    onSelect(e) {
        if (this.selectValue) {
            this.selectValue.selected_name = this.state.data.name;
            this.selectValue.selected_path = this.state.data.path;
        }
        if (this.selectItem.e) {
            $(this.selectItem.e).removeClass("tree-item-selected");
        }
        let t = e.target;
        if (e.target.tagName != "DIV")
            t = e.target.parentNode;
        $(t).addClass("tree-item-selected");
        this.restate();
        this.selectItem.e = t;
    }

    restate() {
        if ($("#treeEdit")) {
            $("#treeEdit").blur();
        }
        if ($("#deleteButton")) {
            $("#deleteButton").blur();
        }
    }

    editFocus() {
        let _this = this;
        if (this.state.data.status == "edit") {
            $("#treeEdit").focus();
            $("#treeEdit").select();
        }
    }

    deleteButtonFocus() {
        if (this.state.data.status == "delete") {
            $("#deleteButton").focus();
        }
    }

    componentDidMount() {
        this.editFocus();
    }

    componentDidUpdate() {
        this.editFocus();
        this.deleteButtonFocus();
    }

    onDeleteButtonBlur() {
        this.state.data.status = "";
        this.setState(this.state);
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            data: nextProps.data
        });
    }

    onDeleteButtonClick(e) {
        console.log(this.props.status);
        e.stopPropagation();
        this.props.onDelete(this.state.data.name, this.state.data.path);
    }

    onEditBlur() {
        let name = $("#treeEdit").val();
        if (!name) {
            name = this.state.data.name;
        }
        //console.log("name:",name);
        if (name == "") {//new,no new
            this.props.onDelete(name, this.state.data.path);
        } else if (name == this.state.data.name) {
            this.state.data.status = "";
            this.setState({
                data: this.state.data
            });
            return;
        } else {
            this.state.data.status = "";
            let actionStatus = false;
            if (this.state.data.name == "") {//new
                let oldPath = this.state.data.path;
                this.state.data.name = name;
                console.log("oldPath",oldPath);
                if (this.state.data.sub) {
                    actionStatus = this.props.onAddFolder(this.state.data.path + "/" + name);
                } else {
                    actionStatus = this.props.onAddFile(this.state.data.path + "/" + name);
                }

                if (actionStatus) {
                    this.state.data.path = this.state.data.path + "/" + name;
                    this.setState({
                        data: this.state.data
                    });
                } else {
                    this.state.data.name = "";
                    this.state.data.status = "edit";
                    this.state.data.path = oldPath;
                    this.setState({
                        data: this.state.data
                    });
                }

            } else {//rename
                let rName = this.state.data.name;
                let oldName = "";
                if (this.state.data.sub) {//folder
                    oldName = this.state.data.path;
                    let path = this.state.data.path;
                    let index = path.lastIndexOf("/");
                    this.state.data.path = path.substring(0, index) + "/" + name;
                    actionStatus = this.props.onRename(oldName, this.state.data.path);
                    this.state.data.name = name;
                    if (actionStatus) {
                        this.reNameSub(this.state.data.sub, this.state.data.path);
                    } else {
                        this.state.data.path = oldName;
                    }

                } else {//file
                    oldName = this.state.data.path;
                    let index = oldName.lastIndexOf("/");
                    var newName  = oldName.substring(0, index) + "/" + name;
                    this.state.data.name = name;
                    this.state.data.path = newName;
                    actionStatus = this.props.onRename(oldName, newName);
                }
                if (actionStatus) {
                    this.setState({
                        data: this.state.data
                    });
                } else {
                    this.state.data.name = rName;
                    this.setState({
                        data: this.state.data
                    });
                }
            }

        }
    }

    reNameSub(sub, path) {
        if (sub && sub.length > 0) {
            for (let i = 0; i < sub.length; i++) {
                sub[i].path = path + sub[i].path.substring(path.length - 2);
                this.reNameSub(sub[i].sub, path);
            }
        }

    }



    render() {
        if (this.layer == 0) {
             this.state.data.open = true;
        }
        let className = "tree-padding " + (this.isSub() ? (this.state.data.open ? "fa fa-folder-open-o" : "fa fa-folder-o") : getFileCss(this.state.data.name));
        let nextLayer = this.layer + 1;
        let padding = (this.layer * 20 + 10) + "px";
        return (
            <div id="fileTree">
                {this.state.data.status == 'edit' ? <div style={{ "padding-left": padding }} className="tree-folder" >
                    {this.isSub() ? <span className={className} ></span> : ""}<input type='text' id="treeEdit" onBlur={this.onEditBlur.bind(this)} className="tree-edit" defaultValue={this.state.data.name} />
                </div> :
                    <div style={{ "padding-left": padding }} className="tree-folder" onMouseOver={this.onOver} onMouseOut={this.onOut} onMouseDown={this.state.data.status == 'delete' ? "" : this.onItemclick.bind(this)} onDoubleClick={this.onDoubleClick.bind(this)}>
                        <span className={className} ></span>
                        <span className="tree-fileName" title={this.state.data.name}>{this.state.data.name}</span>
                        {this.state.data.status == 'delete' ? <span className="tree-button"><button id="deleteButton" onBlur={this.onDeleteButtonBlur.bind(this)} onClick={this.onDeleteButtonClick.bind(this)} type="button" className="btn btn-default btn-xs">
                            删除 ?
                           </button></span> : ""}
                    </div>
                }
                {this.isSub() && this.state.data.open ? this.state.data.sub.map((entry, index) => (<TreeView onListDir={this.onListDir} onAddFolder={this.props.onAddFolder} onAddFile={this.props.onAddFile} onRename={this.props.onRename} data={entry} action={this.action} selectValue={this.selectValue} selectItem={this.selectItem} layer={nextLayer} onDelete={this.props.onDelete} />)) : ""}
            </div>
        )
    }
}