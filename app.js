const path = require('path');
const { app, BrowserWindow } = require('electron');


createWindow = async() => {
    const win = new BrowserWindow({
        //titleBarStyle: 'hidden',
        title: "V_Database Beta_v1",
        autoHideMenuBar: true,
        menuBarVisible: false,
        darkTheme: true,
        titleBarOverlay: true,
        width: 800,
        height: 600,
        acceptFirstMouse: true,
        backgroundColor: '#102030',
        webPreferences: {
            preload: path.join(__dirname, 'source/app/preload.js')
        }
    });

    win.loadFile('./source/app.html');
};

app.whenReady().then(async () => {
    await createWindow();

    app.on('activate', async () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            await  createWindow();
        }
    });
});

app.on('window-all-closed', async () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
