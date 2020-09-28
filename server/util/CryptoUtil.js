var crypto = require('crypto');
const algorithm = 'aes-192-cbc';
var CryptoUtil = {
    password: "fnJt7EDzjqWjcaY945678902",
    iv : Buffer.from('fnJt7EDzjqWjcaY9', 'utf8'),
    /**
     * @aes192加密模块
     * @param str string 要加密的字符串
     * @param secret string 要使用的加密密钥(要记住,不然就解不了密啦)
     * @retrun string 加密后的字符串
     * */
    getEncAse192: function (str, secret) {
        var cipher = crypto.createCipheriv(algorithm, secret,this.iv); //设置加密类型 和 要使用的加密密钥
        var enc = cipher.update(str, "utf8", "hex");    //编码方式从utf-8转为hex;
        enc += cipher.final("hex"); //编码方式从转为hex;
        return enc; //返回加密后的字符串
    },

    getDecAse192: function (str, secret) {
        var decipher = crypto.createDecipher(algorithm, secret,this.iv);
        var dec = decipher.update(str, "hex", "utf8");//编码方式从hex转为utf-8;
        dec += decipher.final("utf8");//编码方式从utf-8;
        return dec;
    },

    getTimeToken: function (ip) {
        var this_time = new Date().getTime();
        this_time = this_time + 1000 * 60 * 60;
        this_time = this_time + "|" + ip;
        console.log(this_time);
        return this.getEncAse192(this_time, this.password);
    },

    valiTimeToken: function (str, ip) {
        if (str == null || str == "" || str.length < 5) return false;
        var this_time = new Date().getTime();
        var value = this.getDecAse192(str, this.password);
        
        var vs = value.split("|");
        if (vs.length < 1) return false;
        console.log(ip+(vs[1] == ip));
        console.log(Number(vs[0]));
        console.log(this_time);
        console.log(Number(vs[0]) > this_time);
        if (Number(vs[0]) > this_time && vs[1] == ip) {
            return true;
        } else {
            return false;
        }
    },

    getUserToken: function (user, ip) {
        var this_time = new Date().getTime();
        var interval = 1000 * 60 * 60;
        this_time = this_time + interval;
        var cryptoUtil_this_time = this_time + "|" + user + "|" + ip;
        var token = interval + "." + user + "." + this.getEncAse192(cryptoUtil_this_time, this.password);
        var tokenBuffer = Buffer.from(token);
        return tokenBuffer.toString('base64');
    },

    takenUserToken: function (str, ip) {
        if (str == null || str == "" || str.length < 5) return false;
        var tokenBuffer = Buffer.from(str,'base64');
        str = tokenBuffer.toString();
        var values = str.split(".");
        if(values.length<3)return false;
        var user = values[1];
        var value = this.getDecAse192(values[2], this.password);
        var vs = value.split("|");
        if (vs.length < 1) return false;
        var this_time = new Date().getTime();
        if (Number(vs[0]) > this_time && vs[1] == user && vs[2] == ip) {
            return user;
        } else {
            return false;
        }
    },

}
module.exports = CryptoUtil;


