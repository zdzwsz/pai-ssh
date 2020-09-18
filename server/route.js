var services=[];
function route(app){
    app.post('/:service/:action/do',function(req,res,next){
        let serviceName = req.params.service;
        var service = services[serviceName];
        if(service ==null){
            console.log("load service:"+serviceName);
            service = require("./service/"+serviceName+".js");
            services[serviceName]=service;
        }
        var result = service(req.body.name,req.body.pass);
        res.send({'status':result});
    });
}
module.exports = route;