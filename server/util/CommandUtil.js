var jsondata = require("../data/LK.json")
var data = new Map();
var data_specific = new Map();
const splitString = "&nbsp&nbsp/&nbsp&nbsp";
var code =":"
for(var i=0;i < jsondata.length; i++){
    data.set(jsondata[i].name,jsondata[i].detail);
    data_specific.set(jsondata[i].name,jsondata[i].specific);
}
var CommandUtil = {
    getPrompt: function (str) {
        if(str.length > 0){
            if(str.length > 5 && str.indexOf("sudo") == 0){//sudo 不在提示
                str = str.substring(5)
            }
            for (var key of data.keys()) {
                let index = str.indexOf(key)
                if(index>=0){
                    if(str.length > key.length){
                        if(str.charCodeAt(key.length) != 32 ){
                            continue;
                        }
                    }
                    return code+data.get(key);
                }
            }
            var keystrings = "";
            for (var key of data.keys()) {
                if(key.indexOf(str) == 0){
                    keystrings += key + splitString;
                }
            }
            if(keystrings.length > 0){
                return keystrings.substring(0,keystrings.length - splitString.length);
            }else{
                return "close";
            }
        }
    },
    getSpecific: function(str){
        if(str.length > 0){
            if(str.length > 5 && str.indexOf("sudo") == 0){//sudo 不在提示
                str = str.substring(5)
            }
            for (var key of data.keys()) {
                if(str.indexOf(key) == 0){
                    //console.log("key:"+ key +" | " + "str:" +str +"|" + data_specific.get(key));
                    return data_specific.get(key);
                }
            }
        }
    }
}
module.exports = CommandUtil;