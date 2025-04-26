import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import { injectListenEvents } from './events/events';

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
        console.log('window close', 'main.ts::172222行');
    });

    // win.webContents.openDevTools({ mode: 'undocked' });
    injectListenEvents();

    return win;
}

app.whenReady().then(async () => {
    createMainWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createMainWindow();
    });
});
