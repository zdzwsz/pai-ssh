var log4js = require('log4js');  
log4js.configure({
    appenders: [  
        {
            type: 'console',
            category: "console"
        }, //控制台输出
        {  
            type: "dateFile",  
            filename: 'logs/log.log',  
            pattern: "_yyyy-MM-dd",  
            alwaysIncludePattern: false,  
            category: 'dateFileLog'  
        }//日期文件格式  
    ],  
    replaceConsole: true,   //替换console.log  
    levels:{  
        dateFileLog: 'debug'  
    }  
});  
  
var dateFileLog = log4js.getLogger('dateFileLog');
var consoleLog = log4js.getLogger('console');
var slog = consoleLog;
exports.logger = consoleLog;  
exports.use = function(app) {  
    //页面请求日志,用auto的话,默认级别是WARN 
    app.use(log4js.connectLogger(dateFileLog, {level:'debug', format:':method :url'}));  
}
exports.debug = function(str){
    slog.debug(str);
}
exports.info = function(str){
    slog.info(str);
}
exports.warn = function(str){
    slog.warn(str);
}
exports.error = function(str){
    slog.error(str);
}