function closeWindow() {
    if (typeof (ipcRenderer) != "undefined") {
        ipcRenderer.send('window-close');
    }
}
function minWindow() {
    if (typeof (ipcRenderer) != "undefined") {
        ipcRenderer.send('window-min');
    }
}
function maxWindow() {
    if (typeof (ipcRenderer) != "undefined") {
        ipcRenderer.send('window-max');
    }
}

function openWindowFolder(fileName, isPath) {
    if (typeof (ipcRenderer) != "undefined") {
        if (fileName) {
            ipcRenderer.send('window-floder', { fileName: fileName, isPath: isPath });
        } else {
            ipcRenderer.send('window-floder');
        }

    }
}

function openDevTools() {
    if (typeof (ipcRenderer) != "undefined") {
        ipcRenderer.send('openDevTools');
    }
}

if (typeof (ipcRenderer) != "undefined") {
    maxWindow();
}


function showNum() {
    var times = countAllFilesList();
    if (times > 0) {
        var text = '<span class="badge">' + times + '</span>'
        $("#download-num").empty();
        $("#download-num").append(text);
    } else {
        $("#download-num").empty();
    }

}
var tipString = 'title="';
function getFileProcessHtml(name, type, status, istip) {
    var tip = "";
    if (istip) {
        tip = tipString + name + '"';
    }
    var statusText = "";
    if (status == "over") {
        statusText = "完成";
    } else if (status == 0) {
        statusText = "准备";
    }
    else {
        statusText = status + "%";
    }
    return '<span class="badge" ' + tip + '><i class="fa fa-arrow-circle-' + type + '" />' + statusText + '</span>'
}

function getFileListHtml(name, type, status) {
    if (type === "no") {
        return '<li class="list-group-item">' + name + '</li>';
    }
    return '<li class="list-group-item filelist-cursor">' + getFileProcessHtml(name, type, status, true) + name + '</li>';
}

function showProcess() {
    $("#downloadprocesscss").empty()
    allFileList.forEach(file => {
        if (file.status != "over") {
            $("#downloadprocesscss").append(getFileProcessHtml(file.name, file.type, file.status, true));
        }
    });

    //$(function () { $("[data-toggle='tooltip']").tooltip(); });
}

function buildFileList() {
    $("#allFileList").empty()
    let i = 0;
    allFileList.forEach(file => {
        var obj = $(getFileListHtml(file.fileName, file.type, file.status));
        $("#allFileList").append(obj);
        if (file.type == "down") {
            obj.click(function () {
                openWindowFolder(file.fileName);
            });
        } else {
            obj.click(function () {
                openWindowFolder(file.name, true);
            });
        }
        i++;
    });

    if (i == 0) {
        $("#allFileList").append(getFileListHtml("空列表", 'no', 0));
    }
    //$(function () { $("[data-toggle='tooltip']").tooltip(); });
}

function createId(id) {
    var times = new Date().getTime()
    times = times + "" + Math.ceil(Math.random() * 10);
    if (id) {
        times = times + id;
    }
    return times;
}

function changeAllFileListStatus(sid, stauts) {
    allFileList.forEach(file => {
        if (file.sid == sid) {
            if (file.status != "over") {
                file.status = stauts;
            }
            return;
        }
    });
}


function countAllFilesList() {
    var index = 0;
    allFileList.forEach(file => {
        if (file.status != "over") {
            index++;
        }
    });
    return index;
}

var allFileList = [];
//var downloadFiles = [];

function downloadFile(name, sshid) {
    var socket = io('/download');
    var sid = createId();
    socket.emit('filePath', { path: name, sshid: sshid, sid: sid });
    let fileName = name.substring(name.lastIndexOf("/") + 1);
    allFileList.unshift({ sid: sid, status: 0, name: name, type: "down", fileName: fileName });
    showNum();
    socket.on('transferred:' + sid, function (msg) {
        if (msg) {
            var porcess = Math.ceil((msg.transferred / msg.total) * 100);
            changeAllFileListStatus(msg.sid, porcess);
            showProcess();
        }
    });
    socket.on('over:' + sid, function (msg) {
        if (msg) {
            changeAllFileListStatus(msg.sid, "over");
            showNum();
            showProcess();
            toastr.info(name + " 下载完成！");
        }
    });

}

//var uploadFiles = [];

function getUploadFile() {
    for (let i = 0; i < allFileList.length; i++) {
        if (allFileList[i].status == 0 && allFileList[i].type == "up") {
            return allFileList[i];
            break;
        }
    }
    return null;
}

function uploadFile(localFiles, remotePath, sshid) {
    remotePath = remotePath.lastIndexOf("/") == remotePath.length ? remotePath : remotePath + "/";
    for (let i = 0; i < localFiles.length; i++) {
        var sid = createId(i);
        let fileName = localFiles[i].substring(localFiles[i].lastIndexOf("\\") + 1);
        allFileList.unshift({ sid: sid, status: 0, name: localFiles[i], remotePath: remotePath + fileName, sshid: sshid, type: "up", fileName: fileName });
    }
    var socket = io('/upload');
    uploading(getUploadFile(), socket);
}

function uploading(localFile, socket) {
    if (localFile == null) {
        socket.close();
        $("#refresh_").click();//刷新目录
        return;
    } else {
        showNum();
    }
    socket.emit('uploadFileOpt', { localFile });
    socket.on('transferred:' + localFile.sid, function (msg) {
        if (msg) {
            var porcess = Math.ceil((msg.transferred / msg.total) * 100);
            changeAllFileListStatus(msg.sid, porcess);
            //console.log(porcess);
            showProcess();
        }
    });
    socket.on('over:' + localFile.sid, function (msg) {
        if (msg) {
            toastr.info(localFile.name + " 上传完成！");
            changeAllFileListStatus(localFile.sid, "over");
            setTimeout(() => {
                showNum();
                showProcess();
                uploading(getUploadFile(), socket);
            }, 100);
        }
    });
}
var openSelectedItem = false;
function openSelectFiles(remotePath, sshid) {
    if (typeof (ipcRenderer) != "undefined") {
        ipcRenderer.send('open-directory-dialog', { remotePath: remotePath, sshid: sshid });
        if (!openSelectedItem) {
            openSelectedItem = true;
            ipcRenderer.on('selectedItem', function (e, opts) {
                uploadFile(opts.filePaths, opts.remotePath, opts.sshid);
            });
        }
    }
}
var filetimeout = null
function showFileListStatus(status) {
    if (!status) {
        $("#fileListStatus").fadeOut(100);
    } else {
        buildFileList();
        $("#user_logout").focus();
        $("#fileListStatus").fadeIn(100);
    }
}

$(function () {
    toastr.options = {
        "closeButton": true,
        "positionClass": "toast-bottom-right",
        "timeOut": "3000"
    };
})
$(function () { $("[data-toggle='tooltip']").tooltip(); });
$(window).click(function () {
    showFileListStatus(false);
})