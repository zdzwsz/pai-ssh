var SshUtils = require("./SshUtils");


var sshUtils1 = new SshUtils();
sshUtils1.connect({
    host: '122.51.193.30',
    port: 22,
    username: 'root',
    password: '@Wszzdz123'
}, function () {
    const step = function(transferred,chunk,total){
        console.log("transferred:"+transferred,"chunk:"+chunk,"total:"+total);
    };
    //sshUtils1.downloadFile("/root/Graph_Databases_2e_Neo4j.pdf","d:/data/Graph_Databases_2e_Neo4j.pdf", 
    //sshUtils1.downloadFile("/root/939.gif","d:/data/939.gif", 
    //sshUtils1.downloadFile("/root/中台.pdf","d:/data/中台.pdf", 
    //function (error, ddata) {
    //    sshUtils1.disconnect();
    //},
    //{"step":step});
    sshUtils1.uploadFile("E:\\data\\1.pptx","/root/tool/1.pptx", 
    function (error, ddata) {
        if(error){
            console.log(error);
        }
       sshUtils1.disconnect();
    },
    {"step":step});
});

