import { app, BrowserWindow } from 'electron';
import path from 'path';

function createMainWindow() {
    const win = new BrowserWindow({
        width: 850,
        height: 500,
        autoHideMenuBar: true,
        webPreferences: {
            preload: path.resolve(__dirname, 'preload.js'),
            nodeIntegration: false,
            autoplayPolicy: 'document-user-activation-required',
        },
    });
    win.loadURL('http://localhost:8080');

    win.on('close', async () => {
        console.log('window close', 'main.ts::17行');
    });

    win.webContents.openDevTools({ mode: 'undocked' });

    return win;
}

app.whenReady().then(async () => {
    createMainWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createMainWindow();
    });
});
