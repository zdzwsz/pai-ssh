"use strict"
var Client = require("../ssh2").Client;
var fs = require("fs");
var through = require('through');

function SshUtils() {
	this.conn = new Client();
}

/**
* 描述：连接远程机器
* 参数：server,远程机器凭证；
*		then,回调函数
*/
SshUtils.prototype.connect = function (server, then, errorthen) {
	var that = this;
	this.conn.on('ready', function () {
		if (then)
			then();
	}).on('error', function (err) {
		console.log(server['host'] + ' error.' + err);
		if (errorthen) {
			errorthen(err)
		}
	}).on('close', function (had_error) {
		if (had_error) {
			console.log(server['host'] + ' close.' + had_error);
		}
	}).connect(server);
};

/**
* 描述：断开远程连接
* 参数：then,回调函数
*/
SshUtils.prototype.disconnect = function (then) {
	this.conn.on('end', function () {
		if (then)
			then();
	});
	this.conn.end();
};

/**
* 描述：执行shell命令
* 参数：cmd,要执行的命令；
*		then,回调函数
* 回调：then(err, data):data 运行命令之后的返回信息
*/
SshUtils.prototype.exec = function (cmd, then, errCallBack) {
	this.conn.exec(cmd, function (err, stream) {
		if (err) {
			console.log("ssh err:" + err);
			if (errCallBack) {
				errCallBack(err);
			}
			return;
		}
		var data = "";
		stream.pipe(through(function onWrite(buf) {
			data = data + buf;
		}, function onEnd() {
			stream.unpipe();
		}));
		stream.on('close', function () {
			if (then)
				then(null, '' + data);
		});
	});
};


SshUtils.prototype.getFileList = function (remotePath, then) {
	var fullPath = remotePath;
	if (fullPath.lastIndexOf("/") != fullPath.length - 1) {
		fullPath = fullPath + "/";
	}
	var cmd = "ls " + fullPath + " -F";
	//console.log(cmd);
	var that = this;
	this.exec(cmd, function (err, data) {
		var arr = [];
		arr = data.split("\n");
		//arr.sort(sortFolder);
		let root = {};
		root.name = "根目录";
		root.path = fullPath;
		let sub = []
		arr.forEach(function (dir) {
			//console.log(dir);
			that.toTreeData(sub, dir, fullPath);
		});
		root.sub = sub;
		//console.log(JSON.stringify(root));
		if (then) {
			then(err, root);
		}

	});
};

SshUtils.prototype.addFolder = function (path, then) {
	var cmd = "mkdir " + path;
	console.log(cmd);
	var that = this;
	this.exec(cmd, function (err, data) {
		if (then)
			then(err, data);
	});
};

//touch 

SshUtils.prototype.addFile = function (path, then) {
	var cmd = "touch " + path;
	console.log(cmd);
	var that = this;
	this.exec(cmd, function (err, data) {
		if (then)
			then(err, data);
	});
};

SshUtils.prototype.reNameFile = function (oldPath, newPath, then) {
	var cmd = "mv " + oldPath + " " + newPath;
	console.log(cmd);
	this.exec(cmd, function (err, data) {
		if (then)
			then(err, data);
	});
};

SshUtils.prototype.deleteFile = function (path, then) {
	var cmd = "rm -rf " + path;
	console.log(cmd);
	this.exec(cmd, function (err, data) {
		if (then)
			then(err, data);
	});
};

SshUtils.prototype.copyFile = function (oldPath, newPath, then) {
	var cmd = "cp -R " + oldPath + " " + newPath;
	console.log(cmd);
	this.exec(cmd, function (err, data) {
		if (then)
			then(err, data);
	});
};

SshUtils.prototype.writeFile = function (remotePath, context, then) {
	this.conn.sftp(function (err, sftp) {
		if (err) { if (then) then(err); } else {
			let stream = sftp.createWriteStream(remotePath);
			stream.write(context, "utf8", function (err) {
				if (then) {
					then(err);
				}
			})
		}
	});
};

SshUtils.prototype.readFile = function (remotePath, then) {
	console.log("remotePath: " + remotePath);
	this.conn.sftp(function (err, sftp) {
		if (err) { if (then) then(err); } else {
			let stream = sftp.createReadStream(remotePath, { start: 0 });
			var buf = [];
			stream.on('readable', data => {
				var chunk;
				while ((chunk = stream.read()) !== null) {
					buf.push(chunk);
				}
			});
			stream.on('error', error => {
				if (then) {
					then(error);
				}
			});
			stream.on('end', data => {
				stream.close();
				if (then) {
					then(null, buf.toString());
				}
			});
		}
	});
};

SshUtils.prototype.uploadFile = function (localPath, remotePath, then, opt) {
	this.conn.sftp(function (err, sftp) {
		if (err) {
			if (then)
				then(err);
		} else {
			let step = {}
			if (opt) {
				step = opt;
			}
			sftp.fastPut(localPath, remotePath, step, function (err, result) {
				sftp.end();
				if (then)
					then(err, result);
			});
		}
	});
};

SshUtils.prototype.downloadFile = function (remotePath, localPath, then, opt) {
	this.conn.sftp(function (err, sftp) {
		if (err) {
			if (then)
				then(err);
		} else {
			let step = {}
			if (opt) {
				step = opt;
			}
			if(fs.existsSync(localPath)){
				const statInfo = fs.statSync(localPath);
				step.sSize = statInfo.size;
			}
			
			sftp.fastGet(remotePath, localPath, step, function (err, result) {
				if (err) {
					if (then)
						then(err);
				} else {
					sftp.end();
					if (then)
						then(err, result);
				}
			});
		}
	});
};



/**
 * {
 * name:zdzwsz,
 * path:/home/zdzwsz,
 * sub[{
 *    name:test,
 *    path:/home/zdzwsz/test,
 *    sub:[]
 * },{
 *    name:aa.txt,
 *    path:/home/zdzwsz/aa.txt
 * }]
 * }
 */
SshUtils.prototype.toTreeData = function (treeData, item, parent) {
	//item = item.replace(/(^\s*)|(\s*$)/g, "");
	if (item == "") {
		return;
	}
	var isfolder = false;
	if (item.lastIndexOf("/") == item.length - 1 || item.lastIndexOf("@") == item.length - 1) {
		item = item.substring(0, item.length - 1);
		isfolder = true;
	} else if (item.lastIndexOf("*") == item.length - 1) {
		item = item.substring(0, item.length - 1);
	}
	let data = {};
	data.name = item;
	data.path = parent + item;
	if (isfolder) {
		data.sub = [];
		treeData.unshift(data);
	} else {
		treeData.push(data);
	}

}

// function sortFolder(a,b)
// {
// 	return a.lastIndexOf("/") == a.length
// }


module.exports = SshUtils;
