var Datastore = require('nedb');
const path = require('path');
const fs = require('fs');
const showPassword = "********"
let currentpath = __dirname;
let databaseFile = path.resolve(currentpath , '../data/data.db');
let databasePath = path.resolve(currentpath , '../data');
if(typeof(__path) != "undefined"){
    currentpath = __path;
    databaseFile = path.resolve(currentpath , './server/data/data.db');
    databasePath = path.resolve(currentpath , './server/data');
}
if(!fs.existsSync(databasePath)){
    fs.mkdirSync(databasePath);
}
//var sTypedb = new Datastore({ filename: databasePath+'/stype.db', autoload: true });
var db = new Datastore({ filename: databaseFile, autoload: true });
var cryptoUtil = require('../util/CryptoUtil');

var dbService = {
    init(app) {
        app.post('/db/insert', function (req, res, next) {
            let data = req.body.data;
            data.password = cryptoUtil.cryptoString(data.password);
            db.insert(data, function (err, newDoc) {
                if (err) {
                    //console.log("error save data");
                    res.send({ 'status': false });
                }
                //console.log("success save data:" + newDoc);
                res.send({ 'status': true, id: newDoc._id });
            });
        });

       //获得服务器分类
        app.post('/db/type/getAll',function(req, res, next){
            
        });
        //增加服务器分类
        app.post('/db/type/insert',function(req, res, next){
            let data = req.body.data;
           
                
        });
        //删除服务器分类
        app.post('/db/type/delete',function(req, res, next){
            let id = req.body.id;
           
        });

        app.post('/db/getAll', function (req, res, next) {
            let user = req.body.name;
            db.find({own:user.username}, function (err, docs) {
                if (err) {
                    res.send({ 'status': false,data:err });
                }
                for(let i =0;i<docs.length;i++){
                    docs[i].password = showPassword;
                }
                res.send({ 'status': true, data: docs });
            });
        });

        app.post('/db/delete', function (req, res, next) {
            let id = req.body.id;
            db.remove({ '_id': id }, { multi: false }, function (err, numRemoved) {
                if (err) {
                    res.send({ 'status': false });
                    return;
                }
                res.send({ 'status': true });
            });
        });

        app.post('/db/update', function (req, res, next) {
            let data = req.body.data;
            //console.log("update setup:" + JSON.stringify(data))
            if(data.password == showPassword){
                delete data.password
            }else{
                data.password = cryptoUtil.cryptoString(data.password);
            }
            db.update({ '_id': data._id }, {$set:data}, function (err, numReplaced) {
                if (err) {
                    res.send({ 'status': false });
                }
                res.send({ 'status': true });
            });
        });

        app.post('/db/validate', function (req, res, next) {
            let id = req.body.id;
            let username = req.body.username;
            let password = req.body.password;
            password = cryptoUtil.cryptoString(password);
            //console.log(id);
            db.find({ '_id': id }, function (err, docs) {
                if (err || docs.length == 0) {
                    res.send({ 'status': false });
                } else {
                    let doc = docs[0];

                    if (doc.username == username && doc.password == password) {
                        res.send({ 'status': cryptoUtil.getTimeToken(req.ip) });
                    } else {
                        res.send({ 'status': false });
                    }
                }
            });
        });
    },

    getSpace(id, callback) {
        db.find({ '_id': id }, function (err, docs) {
            if(docs && docs.length >0){
                docs[0].password = cryptoUtil.decString(docs[0].password);
            }
            callback(err, docs);
        });
    }
}
module.exports = dbService;