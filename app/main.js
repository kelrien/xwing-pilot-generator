const electron = require('electron'),
    app = electron.app,
    BrowserWindow = electron.BrowserWindow,
    ipc = electron.ipcMain,
    dialog = electron.dialog,
    fs = require("fs"),
    os = require("os");

var mainWindow,
    templatesPath;

ipc.on('save', function (event, arg) {
    dialog.showSaveDialog(function (fileName) {
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

ipc.on("templates", function (event, arg) {
    mainWindow.webContents.send("templates", mainWindow.templates);
});

app.on('ready', function () {
    //TODO: string split benutzen um den absoluten pfad zusammenbauen zu können
    //den exakten string zum splitten holst du dir abhängig vom OS

    templatesPath = getTemplatePath();
    checkTemplateDir(templatesPath);


    mainWindow = new BrowserWindow({
        width: 1280,
        minWidth: 1280,
        height: 768,
        minHeight: 768
    });

    mainWindow.templates = fs.readdirSync(templatesPath)
        .filter(folder => folder.endsWith(".css"))
        .map(template => {
            return {
                path: templatesPath + "/" + template,
                name: template
            }
        });

    fs.watch(templatesPath, (event, template) => {
        mainWindow.webContents.send("change", {
            event: event,
            path: templatesPath + "/" + template,
            name: template
        });
    });


    mainWindow.once('ready-to-show', () => {
        mainWindow.show();
    });

    mainWindow.loadURL('file://' + __dirname + '/index.html');

    mainWindow.on('closed', () => {
        mainWindow = null;
        app.quit();
    });
});


/** HELPERS **/

function getTemplatePath() {
    //process cwd
    // dev: app
    // macos: cardforge.app/Contents/Resources/app.asar
    // windows: 
    var regex;
    switch (os.platform()) {
        case "darwin":
            regex = process.env.dev === "true" ? "/app" : "cardforge.app/Contents/Resources/app.asar";
            break;
        case "win32":
            regex = "\\resources\\app.asar"
            break;
        case "linux":
            break;
    }
    return app.getAppPath().split(regex)[0] + "/templates";
}

function checkTemplateDir(path) {
    if (!fs.existsSync(path)) {
        fs.mkdirSync(path);
        //Create the templates folder and the standard template
        fs.createReadStream(__dirname + "/css/_pilot.css")
            .pipe(fs.createWriteStream(path + "/" + "Standard.css"));
        fs.createReadStream(__dirname + "/css/_pilot.less")
            .pipe(fs.createWriteStream(path + "/" + "Standard.less"));
        fs.createReadStream(__dirname + "/css/_colors.less")
            .pipe(fs.createWriteStream(path + "/" + "_colors.less"));
    }
}