var Datastore = require('nedb');
const path = require('path');
const fs = require('fs');
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
var db = new Datastore({ filename: databaseFile, autoload: true });
var cryptoUtil = require('../util/CryptoUtil');
var dbService = {
    init(app) {
        app.post('/db/insert', function (req, res, next) {
            let data = req.body.data;
            db.insert(data, function (err, newDoc) {
                if (err) {
                    console.log("error save data");
                    res.send({ 'status': false });
                }
                console.log("success save data:" + newDoc);
                res.send({ 'status': true, id: newDoc._id });
            });
        });

        app.post('/db/getAll', function (req, res, next) {
            db.find({}, function (err, docs) {
                if (err) {
                    res.send({ 'status': false,data:err });
                }
                res.send({ 'status': true, data: docs });
            });
        });

        app.post('/db/delete', function (req, res, next) {
            let id = req.body.id;
            // let token = req.body.token;

            // if (!cryptoUtil.valiTimeToken(token, req.ip)) {
            //     res.send({ 'status': false });
            //     return;
            // }
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

            db.update({ '_id': data._id }, data, function (err, numReplaced) {
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
            console.log(id);
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
            callback(err, docs);
        });
    }
}
module.exports = dbService;