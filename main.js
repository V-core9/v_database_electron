const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
    const win = new BrowserWindow({
        //titleBarStyle: 'hidden',
        title: "MyDemo Electron App",
        autoHideMenuBar: true,
        menuBarVisible: false,
        darkTheme: true,
        titleBarOverlay: true,
        width: 800,
        height: 600,
        acceptFirstMouse: true,
        backgroundColor: '#102030',
        webPreferences: {
            preload: path.join(__dirname, 'app/preload.js')
        }
    });
    
    //win.maximize();

    win.loadFile('index.html');
}

app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
