SshUtils = require("./SshUtils.js");
// var sshUtils = new SshUtils();
// sshUtils.connect({
//     host: '192.168.245.129',
//     port: 22,
//     username: 'zdzwsz',
//     password: 'zdzwsz123'
// }, function () {
//     sshUtils.getFileList("/home/zdzwsz/", function (error, ddata) {
//         console.log(ddata);
//         sshUtils.disconnect();
//     });
// });
// var sshUtils1 = new SshUtils();
// sshUtils1.connect({
//     host: '192.168.245.129',
//     port: 22,
//     username: 'zdzwsz',
//     password: 'zdzwsz123'
// }, function () {
//     sshUtils1.addFolder("/home/zdzwsz/setup", function (error, ddata) {
//         console.log(ddata);
//         sshUtils1.disconnect();
//     });
// });

// var sshUtils1 = new SshUtils();
// sshUtils1.connect({
//     host: '192.168.245.129',
//     port: 22,
//     username: 'zdzwsz',
//     password: 'zdzwsz123'
// }, function () {
//     sshUtils1.listFile("/home/zdzwsz/22222", function (error, ddata) {
//        if(error){
//            console.log(error);
//        }
//         sshUtils1.disconnect();
//     });
// });

// var sshUtils1 = new SshUtils();
// sshUtils1.connect({
//     host: '192.168.245.129',
//     port: 22,
//     username: 'zdzwsz',
//     password: 'zdzwsz123'
// }, function () {
//     sshUtils1.downloadFile("/home/zdzwsz/22222/SystemUtil.java","d:/test/SystemUtil.java", function (error, ddata) {
//        if(error){
//            console.log(error);
//        }
//         sshUtils1.disconnect();
//     });
// });

var sshUtils1 = new SshUtils();
sshUtils1.connect({
    host: '192.168.245.129',
    port: 22,
    username: 'zdzwsz',
    password: 'zdzwsz123'
}, function () {
    sshUtils1.uploadFile("d:/test/SystemUtil.java", "/home/zdzwsz/22222/SystemUtil.java",function (error, ddata) {
       if(error){
           console.log(error);
       }
        sshUtils1.disconnect();
    });
});

// var sshUtils1 = new SshUtils();
// sshUtils1.connect({
//     host: '192.168.245.129',
//     port: 22,
//     username: 'zdzwsz',
//     password: 'zdzwsz123'
// }, function () {
//     sshUtils1.writeFile("/home/zdzwsz/22222/root.txt","this is a 张大志", function (error, ddata) {
//        if(error){
//            console.log(error);
//        }
//         sshUtils1.disconnect();
//     });
// });

// var sshUtils1 = new SshUtils();
// sshUtils1.connect({
//     host: '192.168.245.129',
//     port: 22,
//     username: 'zdzwsz',
//     password: 'zdzwsz123'
// }, function () {
//     sshUtils1.readFile("/home/zdzwsz/22222/root.txt", function (err,ddata) {
//            console.log(ddata);
//         sshUtils1.disconnect();
//     });
// });


