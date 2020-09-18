var Datastore = require('nedb');
const path = require('path');
const fs = require('fs');
let currentpath = __dirname;
let databaseFile = path.resolve(currentpath , '../data/user.db');
let databasePath = path.resolve(currentpath , '../data');
if(typeof(__path) != "undefined"){
    currentpath = __path;
    databaseFile = path.resolve(currentpath , './server/data/user.db');
    databasePath = path.resolve(currentpath , './server/data');
}

var db = new Datastore({ filename: databaseFile, autoload: true });
var cryptoUtil = require('../util/CryptoUtil');
var pass = [".js", "html", ".css", ".eot", ".svg", ".woff", ".woff2",".map"];
var userService = {
    authentication(req, res, next) {
        let baseUrl = req.baseUrl;
        //console.log("baseUrl:"+ baseUrl);
        if(baseUrl == ""){
            next();
            return;
        }
        for (let i = 0; i < pass.length; i++) {
            if (baseUrl.endsWith(pass[i])) {
                next();
                return;
            } 
        }
        let token = req.cookies.token;
        let user = cryptoUtil.takenUserToken(token, req.ip);
        if (user) {
            req.user = user;
            next();
        } else {
            res.send({ 'status': false, 'message':'expired' });
        }
    },

    init(app) {
        this.initUser();
        app.post('/login', function (req, res, next) {
            var name = req.body.name;
            var pass = req.body.pass;
            //console.log(name);
            db.find({
                name: name,
                passworld: pass
            }, function (err, docs) {
                if (err) {
                    res.send({ 'status': false });
                } else if (docs && docs.length == 1) {
                    var token = cryptoUtil.getUserToken(name, req.ip);
                    res.send({ 'status': true, "token": token });
                } else{
                    res.send({ 'status': false });
                }
            });
        });

        app.post('/token', function (req, res, next) {
            var name = req.body.name;
            var token = req.body.token;
            if (cryptoUtil.takenUserToken(token, req.ip)) {
                token = cryptoUtil.getUserToken(name, req.ip);
                res.send({ 'status': true, "token": token });
            } else {
                res.redirect('/');
            }
        });

    },

    initUser(){
        if(!fs.existsSync(databaseFile)){
            if(!fs.existsSync(databasePath)){
                fs.mkdirSync(databasePath);
            }
            let users = [{
                name: "admin",
                passworld: "123"
            }
            ]
            db.remove({}, { multi: true }, function (err, num) {
                db.insert(users, function (err, newDoc) {});
            });
        }
        
    }

}

module.exports = userService;