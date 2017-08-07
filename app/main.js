var electron = require('electron');
var app = electron.app;
var BrowserWindow = electron.BrowserWindow;
var ipc = electron.ipcMain;
var dialog = electron.dialog;

var mainWindow;

ipc.on('save', function(event, arg) {
    dialog.showSaveDialog(function(fileName) {
        if (!fileName) {
            return;
        } else {
            if (!fileName.endsWith('png')) {
                fileName += ".png"
            }
        }
        fs.writeFile(fileName, arg, 'base64', function (err) {
            if (err) {
                console.log(err);
            }
        });
    });
});

app.on('ready', function () {
    var msg = app.getAppPath();
    //TODO: string split benutzen um den absoluten pfad zusammenbauen zu können
    //den exakten string zum splitten holst du dir abhängig vom OS

    var path = getTemplatePath();
    checkTemplateDir(path);
    var templates = [];

    mainWindow = new BrowserWindow({
        width: 1280,
        minWidth: 1280,
        height: 768,
        minHeight: 768
    });

    mainWindow.once('ready-to-show', () => {
        mainWindow.show()
    });

    mainWindow.loadURL('file://' + __dirname + '/index.html');

    mainWindow.on('closed', function() {
        mainWindow = null;
        app.quit();
    });
});