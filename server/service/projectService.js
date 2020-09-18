SshUtils = require("../util/SshUtils.js");
const fs = require('fs');
var async = require('async');
const os = require('os');
var tempdir = os.tmpdir();
var formidable = require('formidable');
if (!tempdir) {
    tempdir = os.homedir + "/temp";
}
var dbService = require('./dbService.js');
var servers = {}
var projectService = {
    env(id, callback, args, res) {
        _this = this;
        args.push(res);
        let spaceInfo = servers[id];
        if (spaceInfo) {
            args.unshift(spaceInfo);
            callback.apply(null, args);
        } else {
            dbService.getSpace(id, function (err, docs) {
                if (err) {
                    _this.errHandle(err, res);
                } else {
                    var spaceInfo = docs[0];
                    spaceInfo.readyTimeout=10000;
                    servers[spaceInfo._id] = spaceInfo;
                    args.unshift(spaceInfo);
                    callback.apply(null, args);
                }
            })
        }
    },
    errHandle(err, res) {
        res.send({ 'status': false, 'error': err });
    },
    loadSpaceSData(spaceInfo, sshUtils, res) {
        sshUtils.connect(spaceInfo, function () {
            sshUtils.getFileList(spaceInfo.path, function (error, ddata) {
                res.send({ 'status': ddata });
                sshUtils.disconnect();
            });
        },function(error){
            res.send({ 'status': false,"message":error });
            sshUtils.disconnect();

        });
    },
    readDir(spaceInfo, sshUtils , path, res) {
        sshUtils.connect(spaceInfo, function () {
            sshUtils.getFileList(path, function (error, ddata) {
                res.send({ 'status': ddata });
                sshUtils.disconnect();
            });
        });
    },
    readFileData(spaceInfo, sshUtils, path, name, res) {
        sshUtils.connect(spaceInfo, function () {
            sshUtils.readFile(path, function (error, data) {
                if (error) {
                    res.send({ 'status': false });
                } else {
                    res.send({ 'status': data });
                }
            });
        });
    },
    saveFileData(spaceInfo, sshUtils, path, name, code, res) {
        sshUtils.connect(spaceInfo, function () {
            console.log(path);
            sshUtils.writeFile(path, code, function (error) {
                if (error) {
                    res.send({ 'status': false });
                } else {
                    res.send({ 'status': true });
                }
            });
        });
    },
    addfolder(spaceInfo, sshUtils, path, res) {
        sshUtils.connect(spaceInfo, function () {
            sshUtils.addFolder(path, function (error, ddata) {
                if (error) {
                    res.send({ 'status': false });
                } else {
                    res.send({ 'status': true });
                }
            });
        });
    },
    addfile(spaceInfo, sshUtils, path, res) {
        sshUtils.connect(spaceInfo, function () {
            sshUtils.addFile(path, function (error, ddata) {
                if (error) {
                    res.send({ 'status': false });
                } else {
                    res.send({ 'status': true });
                }

            });
        });
    },
    renamefile(spaceInfo, sshUtils, oldPath, newPath, res) {
        sshUtils.connect(spaceInfo, function () {
            sshUtils.reNameFile(oldPath, newPath, function (error, ddata) {
                if (error) {
                    res.send({ 'status': false });
                } else {
                    res.send({ 'status': true });
                }
            });
        });
    },
    deletefile(spaceInfo, sshUtils, path, res) {
        sshUtils.connect(spaceInfo, function () {
            sshUtils.deleteFile(path, function (error, ddata) {
                if (error) {
                    res.send({ 'status': false });
                } else {
                    res.send({ 'status': true });
                }
            });
        });
    },
    copyfile(spaceInfo, sshUtils, oldPath, newPath, res) {
        sshUtils.connect(spaceInfo, function () {
            sshUtils.copyFile(oldPath, newPath, function (error, ddata) {
                if (error) {
                    res.send({ 'status': false });
                } else {
                    res.send({ 'status': true });
                }
            });
        });
    },
    cutfile(spaceInfo, sshUtils, oldPath, newPath, res) {
        sshUtils.connect(spaceInfo, function () {
            sshUtils.reNameFile(oldPath, newPath, function (error, ddata) {
                if (error) {
                    res.send({ 'status': false });
                } else {
                    res.send({ 'status': true });
                }
            });
        });
    },

    init(app) {
        _this = this;
        app.post('/sshProject', function (req, res, next) {
            var sshUtils = new SshUtils();
            let id = req.body.id;
            _this.env(id, _this.loadSpaceSData, [sshUtils], res);
        });

        app.post('/sshProject/dir', function (req, res, next) {
            var sshUtils = new SshUtils();
            let id = req.body.id;
            let path = req.body.path;
            _this.env(id, _this.readDir, [sshUtils,path], res);
        });

        app.post('/sshProject/read', function (req, res, next) {
            var sshUtils = new SshUtils();
            var path = req.body.path;
            var name = req.body.name;
            let id = req.body.id;
            let spaceInfo = servers[id];
            _this.env(id, _this.readFileData, [sshUtils, path, name], res);
        });

        app.post('/sshProject/save', function (req, res, next) {
            var sshUtils = new SshUtils();
            var path = req.body.path;
            var name = req.body.name;
            var code = req.body.code;
            let id = req.body.id;
            _this.env(id, _this.saveFileData, [sshUtils, path, name, code], res);
        });

        app.post('/sshProject/addfolder', function (req, res, next) {
            var sshUtils = new SshUtils();
            var path = req.body.path;
            var id = req.body.id;
            _this.env(id, _this.addfolder, [sshUtils, path], res);
        });

        app.post('/sshProject/addfile', function (req, res, next) {
            var sshUtils = new SshUtils();
            var path = req.body.path;
            var id = req.body.id;
            _this.env(id, _this.addfile, [sshUtils, path], res);
        });

        app.post('/sshProject/renamefile', function (req, res, next) {
            var sshUtils = new SshUtils();
            let _res = res;
            var oldPath = req.body.oldPath;
            var newPath = req.body.newPath;
            var id = req.body.id;
            _this.env(id, _this.renamefile, [sshUtils, oldPath, newPath], res);
        });

        app.post('/sshProject/deletefile', function (req, res, next) {
            var sshUtils = new SshUtils();
            var path = req.body.path;
            var id = req.body.id;
            _this.env(id, _this.deletefile, [sshUtils, path], res);
        });

        app.post('/sshProject/copyfile', function (req, res, next) {
            var sshUtils = new SshUtils();
            var oldPath = req.body.oldPath;
            var newPath = req.body.newPath;
            var id = req.body.id;
            _this.env(id, _this.copyfile, [sshUtils, oldPath, newPath], res);
        });

        app.post('/sshProject/cutfile', function (req, res, next) {
            var sshUtils = new SshUtils();
            var oldPath = req.body.oldPath;
            var newPath = req.body.newPath;
            var id = req.body.id;
            _this.env(id, _this.cutfile, [sshUtils, oldPath, newPath], res);
        });

        app.post('/sshProject/downloadfile', function (req, res, next) {
           
            var sshUtils = new SshUtils();
            let _res = res;
            var name = req.body.name;
            var path = req.body.path;
            var id = req.body.id;
            console.log("id:"+id);
            var remotePath = path; //"/home/zdzwsz/22222/SystemUtil.java";
            var localPath = tempdir + "/" + name;// "d:/test/SystemUtil.java";
            console.log("localPath:"+localPath);
            console.log("remotePath:"+remotePath);
            sshUtils.connect(servers[id], function () {
                sshUtils.downloadFile(remotePath, localPath, function (error, ddata) {
                    if (error) {
                        res.status(404).end();
                        return;
                    }
                    var stats = fs.statSync(localPath);
                    if (stats.isFile()) {
                        res.set({
                            'Content-Type': 'application/octet-stream',
                            'Content-Disposition': 'attachment; filename=' + name,
                            'Content-Length': stats.size
                        });
                        fs.createReadStream(localPath).pipe(_res);
                    } else {
                        res.status(404).end();
                    }
                });
            });
        });

        app.post('/sshProject/uploadfile', function (req, res, next) {
            var obj = {};
            var form = new formidable.IncomingForm({
                encoding: "utf-8",
                uploadDir: tempdir,  //文件上传地址
                keepExtensions: true  //保留后缀
            });
            form.parse(req)
                .on('field', function (name, value) {  // 字段
                    obj[name] = value;
                })
                .on('file', function (name, file) {  //文件
                    obj[name] = file;
                })
                .on('error', function (error) {  //结束
                    res.send({ 'status': false });
                })
                .on('end', function () {  //结束
                    console.log(JSON.stringify(obj));
                    let localPath = obj.file.path;
                    let remotePath = obj.path + "/" + obj.file.name;
                    console.log(remotePath);
                    let id = obj.id;
                    var sshUtils = new SshUtils();
                    sshUtils.connect(servers[id], function () {
                        sshUtils.uploadFile(localPath, remotePath, function (error, ddata) {
                            if (error) {
                                res.send({ 'error': error });
                            } else {
                                res.send({ 'status': true });
                            }
                        });
                    });
                });
        });
    }
}
module.exports = projectService;