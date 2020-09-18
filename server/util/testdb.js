var Datastore = require('nedb');
//console.log(__dirname);
var db = new Datastore({ filename: __dirname + '/../data/user.db', autoload: true });

var users = [{
    name: "admin",
    passworld: "123"
}
]
db.remove({}, { multi: true }, function (err, num) {
    console.log("num:" + num);
    db.insert(users, function (err, newDoc) {
        if (err) {
            console.log(error);
        }
    });
});


