// handle setupevents as quickly as possible
const setupEvents = require('./src/installers/windows_SetupEvents');
if(setupEvents.handleSquirrelEvent()) {
    // squirrel event handled and app will exit in 1000ms, so don't do anything else
    return;
}

// Import parts of electron to use
const {app, Menu, BrowserWindow, remote} = require('electron');
const path  = require('path');
const url   = require('url');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

// Keep a reference for dev mode
let dev = false;

if (process.defaultApp || /[\\/]electron-prebuilt[\\/]/.test(process.execPath) || /[\\/]electron[\\/]/.test(process.execPath)) {
    dev = true;
}

if (process.platform === 'win32') {
    // app.commandLine.appendSwitch('high-dpi-support', 'true')
    // app.commandLine.appendSwitch('force-device-scale-factor', '1')
}

process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true';

function createWindow() {

    // console.log = function() {};

    let browserCfg = {};

    const width  = 1100;
    const height = 660;

    if(process.platform === 'win32'){

        browserCfg = {
            width: width,
            height: height,
            minWidth: width, // set a min width!
            minHeight: height, // and a min height!
            frame: false,
            titleBarStyle: 'hidden', // or 'customButtonsOnHover',
            icon: './src/assets/logo.png',
            title: 'keysafe',
            enableRemoteModule : false,
            nodeIntegration: true
        };

        Menu.setApplicationMenu(null);

    } else if(process.platform === 'darwin'){

        browserCfg = {
            width: width,
            height: height,
            minWidth: width, // set a min width!
            minHeight: height, // and a min height!
            frame: true,
            title: 'keysafe',
            enableRemoteModule : false,
            nodeIntegration: true
        };

        /*
        const menuTemplate  = getMacMenuTemplate();
        const menu          = Menu.buildFromTemplate(menuTemplate);
        */

        //Menu.setApplicationMenu(menu);

    } else { // LINUX (UBUNTU)
        browserCfg = {
            width: width,
            height: height,
            minWidth: width,
            minHeight: height,
            title: 'keysafe',
            icon: './src/assets/logo.png',
            enableRemoteModule : false,
            nodeIntegration: true
        };

        // Standardmenu unter Ubuntu ausmachen

        // const template = createMenu(process.platform);
        // const menu = Menu.buildFromTemplate(template);
        Menu.setApplicationMenu(null);
    }

    global.defaults =  {theme : 'dark'};

    // Create the browser window.
    mainWindow = new BrowserWindow(browserCfg);

    // and load the index.html of the app.
    let indexPath;
    if (dev && process.argv.indexOf('--noDevServer') === -1) {
        indexPath = url.format({
            protocol: 'http:',
            host: 'localhost:8088',
            pathname: 'index.html',
            slashes: true
        });
    } else {
        indexPath = url.format({
            protocol: 'file:',
            pathname: path.join(__dirname, 'dist', 'index.html'),
            slashes: true
        });
    }
    mainWindow.setMenuBarVisibility(false);
    mainWindow.loadURL(indexPath);
    mainWindow.openDevTools();

    // Don't show until we are ready and loaded
    mainWindow.once('ready-to-show', () => {
        mainWindow.show();
    });

    // Emitted when the window is closed.
    mainWindow.on('closed', function () {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null;
    });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
        createWindow();
    }
});
