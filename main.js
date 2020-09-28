// Packages
const { BrowserWindow, app, ipcMain, Menu,clipboard  } = require('electron')
const { join } = require('path')
const apppath = join(__dirname, "/server");
const appCmd = apppath + "/app.js";
const { shell, dialog } = require("electron");


// Prepare the renderer once the app is ready
let mainWindow = null;
let server = null;
app.on('ready', async () => {
  initPath();
  server = require(appCmd);
  mainWindow = new BrowserWindow({
    minWidth: 1300,
    minHeight: 400,
    show: false,
    frame: false,
    transparent: true,
    webPreferences: {
      nodeIntegration: false,
      preload: join(__dirname, 'preload.js'),
    },
  })
  const url = join(__dirname, '/index.htm');
  mainWindow.loadURL(url)
  Menu.setApplicationMenu(null);
  mainWindow.show();
  mainWindow.center();
})


app.on('window-all-closed', function () {
  stop();
  app.quit();
})

ipcMain.on('message', (event, message) => {
  event.sender.send('message', message)
})

ipcMain.on('openDevTools', () => {
  if(mainWindow.webContents.isDevToolsOpened())
  {
    mainWindow.webContents.closeDevTools();
  }else{
    mainWindow.webContents.openDevTools();
  }
})

ipcMain.handle('clipboard.read', function () {
    return clipboard.readText();
})

ipcMain.on('clipboard.write', function (event,text) {
    clipboard.writeText(text);
})

ipcMain.on('window-max', function () {
  //console.log("window-max");
  if (mainWindow.isMaximized()) {
    mainWindow.restore();
  } else {
    mainWindow.maximize();
  }
})

// 选择文件
ipcMain.on('open-directory-dialog', function (event,opts) {
  dialog.showOpenDialog({
    properties: ['openFile', 'multiSelections']
  }).then(result => {
    if(result.canceled)return;
    opts.filePaths=result.filePaths;
    event.reply('selectedItem', opts)
  }).catch(err => {
    console.log(err)
  })
});

//接收最小化命令
ipcMain.on('window-min', function () {
  mainWindow.minimize();
})

const mailurl = 'http://localhost:11880/index.html';
ipcMain.on('new-window', function () {
  mainWindow.loadURL(mailurl)
})

function stop() {
  server.close();
}

ipcMain.on('window-close', function () {
  stop();
  app.quit();
})

ipcMain.on('window-floder', function (event,opts) {
  if(opts && opts.fileName)
    shell.showItemInFolder(global.__path + "\\server\\download\\"+ opts.fileName);
  else
    shell.showItemInFolder(global.__path + "\\server\\download");
})

function initPath() {
  let path = app.getAppPath();
  let index = path.lastIndexOf("\\");
  if (index > 0) {
    let parentPath = path.substring(0, index);
    let fileName = path.substring(index + 1);
    if (fileName != null && fileName != "") {
      if (fileName.lastIndexOf(".") > 0) {
        path = parentPath;
      }
    }
  }
  global.__path = path;
}