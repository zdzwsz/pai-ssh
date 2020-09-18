// Packages
const { BrowserWindow, app, ipcMain, Menu} = require('electron')
const {fork , exec} = require('child_process')
const { join } = require('path')
const apppath = join(__dirname,"/server");
const appCmd =  apppath + "/app.js";



// Prepare the renderer once the app is ready
let mainWindow = null;
let server = null;
app.on('ready', async () => {
    initPath();
    server = require(appCmd);
    mainWindow = new BrowserWindow({
    minWidth: 750,
    minHeight: 400,
    show: false,
    frame: false,
    transparent: true,
    webPreferences: {
      nodeIntegration: false,
      preload: join(__dirname, 'preload.js'),
    },
  })
  mainWindow.center();
  //mainWindow.maximize();
  mainWindow.show();
  const url = join(__dirname, '/index.htm') ;
  mainWindow.loadURL(url)
  //mainWindow.webContents.openDevTools();
  Menu.setApplicationMenu(null);
})
  

app.on('window-all-closed', function(){
  stop();
  app.quit();
})

ipcMain.on('message', (event, message) => {
  event.sender.send('message', message)
})


ipcMain.on('window-max', function() {
  //console.log("window-max");
  if (mainWindow.isMaximized()) {
      mainWindow.restore();
  } else {
      mainWindow.maximize();
  }
})

//接收最小化命令
ipcMain.on('window-min', function() {
  mainWindow.minimize();
})

const mailurl = 'http://localhost:11880/index.html';
ipcMain.on('new-window',function() {
  mainWindow.loadURL(mailurl)
})

function stop(){
   server.close();
}

ipcMain.on('window-close', function() {
  stop();
  app.quit();
})

function initPath(){
  let path = app.getAppPath();
  let index = path.lastIndexOf("\\");
  if(index>0){
    let parentPath = path.substring(0,index);
    let fileName = path.substring(index+1);
    if(fileName!=null && fileName!=""){
      if(fileName.lastIndexOf(".") > 0){
        path = parentPath;
      }
    }
  }
  global.__path = path;
}