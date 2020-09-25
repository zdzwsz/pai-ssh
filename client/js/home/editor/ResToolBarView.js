import Tree from './TreeView';
import Store from './ResToolBarStore'
export default class ResToolBarView extends React.Component {

    constructor(props, context) {
        super(props, context);
        this.onDelete = this.onDelete.bind(this);
        this.onAddFolder = this.onAddFolder.bind(this);
        this.onAddFile = this.onAddFile.bind(this);
        this.onRename = this.onRename.bind(this);
        this.onListDir = this.onListDir.bind(this);
        this.state = {
            data: this.props.data,
            clipboard: null
        };
        //this.socket = this.props.socket;
        
        //console.log(this.props.name);
        this.store = new Store(this, this.props.id);

    }

    componentWillReceiveProps(nextProps) {
        this.setState(
            {
                data: nextProps.data,
                clipboard: null
            }
        );
    }

    componentWillUnmount() {
        //this.socket.close();
    }

    isNotFolderAndTip(path){
        if(!path){
            toastr.warning("先选择一个文件夹，再操作！");
            return true;
        }
        //console.log(this.state.data);
        let node = this.searchTreeData(path);
        if(!node.sub){
            toastr.warning("当前目录不是文件夹,先选择一个文件夹，再操作！");
            return true;
        }
        return false;
    }

    addFile() {
        let path = this.props.selectValue.selected_path;
        if(this.isNotFolderAndTip(path))return;
        let newFile = {
            "name": "",
            "status": "edit",
        }
        this.setFileName(this.state.data, path, newFile);
    }

    addFolder() {
        let path = this.props.selectValue.selected_path;
        if(this.isNotFolderAndTip(path))return;

        let newFile = {
            "name": "",
            "status": "edit",
            "sub": []
        }
        this.setFileName(this.state.data, path, newFile);
    }

    setFileName(treeData, path, newFile) {
        if (treeData.path == path) {
            this.replacePath(newFile, path);
            treeData.sub.push(newFile);
            treeData.open = true;
            this.setState(this.state);
            return true;
        } else {
            let sub = treeData.sub;
            if (sub) {
                for (let i = 0; i < sub.length; i++) {
                    if (this.setFileName(sub[i], path, newFile)) {
                        return;
                    }
                }
            }
        }
    }

    replacePath(newFile, path) {
        if (newFile.sub && newFile.sub.length > 0) {
            newFile.path = path + "/" + newFile.name;
            let sub = newFile.sub;
            for (let i = 0; i < sub.length; i++) {
                this.replacePath(sub[i], newFile.path);
            }
        } else {
            newFile.path = path;
        }
    }

    deleteFile() {
        let name = this.props.selectValue.selected_name;
        let path = this.props.selectValue.selected_path;
        let node = this.searchTreeData(path);
        if (node) {
            node.status = "delete";
            this.setState({
                data: this.state.data
            });
        }
    }

    onAddFolder(path) {
        //检查是否同名
        // console.log("onAddFolder:" + path);
        if (!this.checkSameName(path)) {
            return false;
        }
        this.store.addFolder(path);
        return true;
    }

    onAddFile(path) {
        //检查是否同名
        //  console.log("onAddFile:" + path);
        if (!this.checkSameName(path)) {
            return false;
        }
        this.store.addFile(path);
        return true;
    }

    onRename(oldPath, newPath) {
        //检查是否同名
        // console.log("onRename:" + oldPath + "|" + newPath);
        if (!this.checkSameName(newPath)) {
            return false;
        }
        this.store.reNameFile(oldPath, newPath);
        return true;
    }

    onListDir(path, jsonData) {
        //console.log(JSON.stringify(jsonData));
        this.store.listDir(path, jsonData);
    }

    checkSameName(path) {
        //console.log("path:" + path);
        if (path == null || path == "") return null;
        let index = path.lastIndexOf("/");
        if (index < 0) return null;
        let fileName = path.substring(index + 1);
        path = path.substring(0, index);
        if (path == "") path = "/";
        let parent = this.searchTreeData(path);

        let isSame = 0;
        for (let i = 0; i < parent.sub.length; i++) {
            let p = parent.sub[i];
            //console.log(p.name + "|" + fileName);
            if (p.name === fileName) {
                isSame++;
            }
        }
        // console.log("parent:" + JSON.stringify(parent));
        // console.log(isSame);
        if (isSame > 1) {
            toastr.warning(fileName + "名字已存在，请重新输入！");
            return false;
        }
        return true;
    }

    onDelete(name, path, treeData) {
        //console.log("name:" + name + "|path:" + path);
        if (name == "") {
            let node = this.searchTreeData(path, null, true);
            node.sub.splice(node.sub.length - 1, 1);
            this.setState(this.state);
            return;
        }
        let node = this.searchTreeData(path, null, true);
        if (node) {
            node.parent.splice(node.index, 1);
            this.setState(this.state);
            if (name == "") return;
            this.store.deleteFile(path);
        }
    }
    rename() {
        //let name = this.props.selectValue.selected_name;
        let path = this.props.selectValue.selected_path;
        let node = this.searchTreeData(path);
        //console.log(JSON.stringify(node));
        if (node) {
            node.status = "edit";
            this.setState(this.state);
        }
    }

    copy() {
        this.state.clipboard = {
            "op": "copy",
            "name": this.props.selectValue.selected_name,
            "path": this.props.selectValue.selected_path
        }
        console.log("copy success!");
    }

    cut() {
        this.state.clipboard = {
            "op": "cut",
            "name": this.props.selectValue.selected_name,
            "path": this.props.selectValue.selected_path
        }
    }

    download() {
        //全局方法
        downloadFile(this.props.selectValue.selected_path,this.props.id);
    }

    upload(){
         let path = this.props.selectValue.selected_path;
         if(this.isNotFolderAndTip(path))return;
        // $("#file").click();
        //全局方法 index.html
         openSelectFiles(path,this.props.id);
    }

    //已经删除
    onUpload(){
        let path = $("#file").val();
        console.log(path);
        if(path){
            path = path.substring(0, path.lastIndexOf("\\"));
        }else{
            return;
        }
        console.log(path);
        let files = $("#file").prop('files');
        //全局方法
        uploadFile(files,path,this.props.selectValue.selected_path,this.props.id);
    }
    
    changeSameName(path, newName, code) {
        if (!code) code = 0;
        console.log("path:" + path + " newName:" + newName);
        //let index = path.lastIndexOf("/");
        //let fileName = path.substring(index + 1);
        // let parentPath = path.substring(0, index);
        let parent = this.searchTreeData(path);
        for (let i = 0; i < parent.sub.length; i++) {
            let p = parent.sub[i];
            console.log(p.name + "|" + newName);
            if (p.name === newName) {
                if (newName.indexOf("copy") > -1) {
                    newName = newName.substring(6);
                }
                newName = "copy" + code + "_" + newName;
                code++;
                return this.changeSameName(path, newName, code);
            }
        }
        return newName;
    }

    paste() {
        if (this.state.clipboard) {
            let path = this.props.selectValue.selected_path;
            //if (path == null || path.length == 0) return;
            if(this.isNotFolderAndTip(path))return;
            let node = this.searchTreeData(this.state.clipboard.path);
            let isfolder = node && node.sub;
            if (isfolder) {//file can ，folder not can！
                if (path.indexOf(this.state.clipboard.path) > -1) {
                    console.log("old:" + this.state.clipboard.path + " | new:" + path);
                    toastr.warning("粘贴操作失败，请重新操作！");
                    this.state.clipboard = null;
                    return;
                }
            }
            if (this.state.clipboard.op == "copy") {
                if (node) {
                    let newObject = JSON.parse(JSON.stringify(node));
                    //判断是否重名，重名需要重新命名，再执行
                    let newName = this.changeSameName(path, newObject.name);
                    newObject.name = newName;
                    this.setFileName(this.state.data, path, newObject, false);
                    if (isfolder) {
                        this.store.copyFile(this.state.clipboard.path, path);
                    } else {//file copy
                        this.store.copyFile(this.state.clipboard.path, path + "/" + newName);
                    }
                }
                this.state.clipboard = null;
            } else if (this.state.clipboard.op == "cut") {
                if (node) {
                    let newObject = JSON.parse(JSON.stringify(node));
                    //判断是否重名，重名需要重新命名，再执行
                    let newName = this.changeSameName(path, newObject.name);
                    newObject.name = newName;
                    node = this.searchTreeData(this.state.clipboard.path, null, true);
                    if (node) {
                        node.parent.splice(node.index, 1);
                    }
                    this.setFileName(this.state.data, path, newObject, false);
                    if (isfolder) {
                        this.store.cutFile(this.state.clipboard.path, path);
                    } else {
                        this.store.cutFile(this.state.clipboard.path, path + "/" + newName);
                    }
                }
                this.state.clipboard = null;
            }

        }
        else{
            toastr.warning("粘贴操作失败，请先进行复制或者剪切操作！");
        }
    }



    searchTreeData(path, treeData, isParent, parent, index) {
        if (!treeData) {
            treeData = this.state.data
        }
        //console.log("path:"+ path + "|treeData.path:"+treeData.path);
        if (treeData.path == path) {
            if (isParent) {
                treeData.parent = parent;
                treeData.index = index;
            }
            return treeData;
        } else {
            let sub = treeData.sub;
            if (sub) {
                for (let i = 0; i < sub.length; i++) {
                    let searchValue = this.searchTreeData(path, sub[i], isParent, sub, i);
                    if (searchValue) {
                        return searchValue;
                    }
                }
            }
        }
    }

    componentDidMount() {
        let _this = this;
        //右键菜单
        var menu = new BootstrapMenu('#fileTree', {
            actionsGroups: [
                ['rename'],
                ['delete']
            ],
            actions: {
                rename: {
                    name: '重命名',
                    iconClass: 'fa fa-pencil',
                    onClick: function () {
                        _this.rename();
                    }
                },
                delete: {
                    name: '删除',
                    iconClass: 'fa fa-times',
                    onClick: function () {
                        _this.deleteFile();
                    }
                },
                copy: {
                    name: '复制',
                    iconClass: "fa fa-copy",
                    onClick: function () {
                        _this.copy();
                    }
                },
                cut: {
                    name: '剪切',
                    iconClass: "fa fa-cut",
                    onClick: function () {
                        _this.cut();
                    }
                },
                paste: {
                    name: '粘贴',
                    iconClass: "fa fa-paste",
                    onClick: function () {
                        _this.paste();
                    }
                },
                download: {
                    name: '下载',
                    iconClass: "fa fa-download",
                    onClick: function () {
                        _this.download();
                    }
                },
                upload: {
                    name: '上传',
                    iconClass: "fa fa-upload",
                    onClick: function () {
                        //pekeUpload.selectfiles();
                    }
                }
            }
        });
        // var pekeUpload = $("#file").pekeUpload({
        //     ondata: function (data) {
        //         data.path = _this.props.selectValue.selected_path;
        //         data.id = _this.props.id;
        //     },
        //     onFileError: function (file, error) {
        //         toastr.warning(file.name + "上传失败:" + error);
        //     },
        //     onFileSuccess: function (file, error) {
        //         toastr.info(file.name + "上传成功！");
        //     },
        //     onSelectFileBefore: function () {
        //         if (_this.props.selectValue.selected_path) {
                    
        //             return true;
        //         } else {
        //             toastr.error("请选择上传的文件夹！");
        //             return false;
        //         }
        //     },
        //     onFileUploadOver: function () {
        //         _this.props.reflash();
        //     }
        // });
        //$(function () { $("[data-toggle='tooltip']").tooltip(); });
    }

    render() {
        return (
            <div>
                <div style={{height:"43px","background-color":"#121212","padding":"6px 2px 0 4px"}}>
                    <span style={{"line-height":"30px"}}>
                        <i className="fa fa-server span-padding"></i>{this.props.name}<input id="file" type="file" multiple="multiple" onChange={this.onUpload.bind(this)} name="file" style={{"display":"none"}}  />
                    </span>
                    <span className="btn-group toolbar" style={{float:"right"}}>
                        <button data-toggle="tooltip" data-placement="bottom" title="新增文件夹" onClick={this.addFolder.bind(this)} type="button" className="btn btn-default btn-sm"><span className="fa fa-folder-o"> </span></button>
                        <button data-toggle="tooltip" data-placement="bottom" title="新增文件" onClick={this.addFile.bind(this)} type="button" className="btn btn-default btn-sm"><span className="fa fa-file-o"> </span></button>
                        <button id="refresh_" data-toggle="tooltip" data-placement="bottom" title="刷新" onClick={this.props.reflash} type="button" className="btn btn-default btn-sm"><span className="fa fa-refresh"> </span></button>
                        <button data-toggle="tooltip" data-placement="bottom" title="上传"  onClick={this.upload.bind(this)} type="button" className="btn btn-default btn-sm"><span className="fa fa-upload"> </span></button>
                    </span>
                </div>
                <div className="tab-content">
                    
                    <div className="tab-pane fade in active" id="res_tree">
                        <Tree onListDir={this.onListDir} onAddFolder={this.onAddFolder} onAddFile={this.onAddFile} onRename={this.onRename} data={this.state.data} action={this.props.action} selectValue={this.props.selectValue} onDelete={this.onDelete} />
                    </div>
                </div>
            </div>
        )
    }
}