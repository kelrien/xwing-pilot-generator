var electron = require('electron');
var app = electron.app;
var BrowserWindow = electron.BrowserWindow;
var ipc = electron.ipcMain;
var dialog = electron.dialog;

var mainWindow;

ipc.on('save', function (event, arg) {
  dialog.showSaveDialog(function (fileName) {
    if (!fileName) {
      return;
    } else {
      if (!fileName.endsWith('png')) {
        fileName += ".png"
      }
    }
    require("fs").writeFile(fileName, arg, 'base64', function (err) {
      console.log(err);
    });
  });
});

app.on('ready', function () {

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
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
    app.quit();
  });

});