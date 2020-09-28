//var cryptoUtil = require('./CryptoUtil');

// var a = cryptoUtil.getTimeToken("127.0.0.1");
// console.log(a);
// var v = cryptoUtil.valiTimeToken(a, "127.0.0.1");
// console.log(v);

// var a = "123466666666";
// var b = cryptoUtil.getEncAse192(a,"123456789abcdefg");
// console.log("22:"+b);
// var c = cryptoUtil.getDecAse192(b,"123456789abcdefg");
// console.log("33:"+c);

// const crypto = require('crypto');

// const algorithm = 'aes-192-cbc';
// const password = '用于生成密钥的密码';
// // 改为使用异步的 `crypto.scrypt()`。
// const key = crypto.scryptSync(password, '盐值', 24);
// // 使用 `crypto.randomBytes()` 生成随机的 iv 而不是此处显示的静态的 iv。
// const iv = Buffer.alloc(16, 0); // 初始化向量。

// const cipher = crypto.createCipheriv(algorithm, key, iv);

// let encrypted = cipher.update('要加密的数据', 'utf8', 'hex');
// encrypted += cipher.final('hex');
// console.log(encrypted);

const crypto = require('crypto');

// 加密
function genSign(src, key, iv) {
    let sign = '';
    const cipher = crypto.createCipheriv('aes-128-cbc', key, iv);
    sign += cipher.update(src, 'utf8', 'hex');
    sign += cipher.final('hex');
    return sign;
}

// 解密
function deSign(sign, key, iv) {
    let src = '';
    const cipher = crypto.createDecipheriv('aes-128-cbc', key, iv);
    src += cipher.update(sign, 'hex', 'utf8');
    src += cipher.final('utf8');
    return src;
}

const key = Buffer.from('9vApxLk5G3PAsJrM', 'utf8');
//const iv = Buffer.from('FnJL7EDzjqWjcaY9', 'utf8');
//console.log(iv);
const iv =crypto.randomBytes(16)
//console.log(iv);
const sign = genSign('hello world', key, iv);
console.log(sign); // 764a669609b0c9b041faeec0d572fd7a


// 解密
//const key = Buffer.from('9vApxLk5G3PAsJrM', 'utf8');
//const iv = Buffer.from('FnJL7EDzjqWjcaY9', 'utf8');
const iv1 =crypto.randomBytes(16)
const src=deSign(sign, key, iv);
console.log(src); // hello world