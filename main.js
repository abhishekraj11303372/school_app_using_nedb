// Imports
const electron = require('electron');
const url = require('url');
const path = require('path');
const { platform } = require('os');

const { app, BrowserWindow, Menu, ipcMain } = electron;

//SET ENV(environment)
process.env.NODE_ENV = 'production';


let mainWindow;
let addWindow;


app.on('ready', function () {
    //create new window
    mainWindow = new BrowserWindow({
        webPreferences: { 
            nodeIntegration: true 
        }
    });
    //Load html file in window
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true
    }));
    
    //quite app when closed
    mainWindow.on('closed', function () {
        app.quit();
    });

    //Build  menu from template
    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
    //Insert Menu
    Menu.setApplicationMenu(mainMenu);
});

//Handel create add window
function createAddWindow() {
    //create new window
    addWindow = new BrowserWindow({
        width: 300,
        height: 200,
        title: 'Add Student Data',
        webPreferences: { nodeIntegration: true }
    });

    //Load html file in window
    addWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'addWindow.html'),
        protocol: 'file:',
        slashes: true
    }));

    //Garbage collection handle 
    addWindow.on('close', function () {
        addWindow = null;
    });


}


//Catch item: add 
ipcMain.on('item:add', function (e, item) {
    console.log(item);
    mainWindow.webContents.send('item:add', item);
    addWindow.close();

});



//Create menu template
const mainMenuTemplate = [
    {
        label: 'File',
        submenu: [
            {
                label: 'Quit',
                accelerator: process.platform == 'darwin' ? 'Command+Q' : 'Ctrl+Q',
                click() {
                    app.quit();
                }
            }
        ]
    }
];
//if mac add empty object to menu
if (process.platform == 'darwin') {
    mainMenuTemplate.unshift({ "label": "TODO" });
}

//Add developer tool when not in production
if (process.env.NODE_ENV !== 'production') {
    mainMenuTemplate.push({
        label: 'Developer tools',
        submenu: [
            {
                label: 'Toggle Devtools',
                accelerator: process.platform == 'darwin' ? 'Command+I' : 'Ctrl+I',
                click(item, focusedWindow) {
                    focusedWindow.toggleDevTools();
                }
            },
            {
                role: 'reload'
            }
        ]
    });
}