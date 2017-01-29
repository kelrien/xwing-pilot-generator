var electron = require('electron');
var app = electron.app;
var BrowserWindow = electron.BrowserWindow;
var ipc = electron.ipcMain;
var dialog = electron.dialog;

var mainWindow;

ipc.on('save', (event, arg) => {
  dialog.showSaveDialog((fileName) => {
    if (!fileName) {
      return;
    } else {
      if (!fileName.endsWith('png')) {
        fileName += ".png"
      }
    }
    require("fs").writeFile(fileName, arg, 'base64', (err) => {
      console.log(err);
    });
  });
});

app.on('ready', () => {

  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1024,
    minWidth: 1024,
    height: 700,
    minHeight: 700,
    show: true
  });

  mainWindow.once('ready-to-show', () => {
    mainWindow.show()
  });

  mainWindow.loadURL('file://' + __dirname + '/index.html');

  // Emitted when the window is closed.
  mainWindow.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
    app.quit();
  });
});