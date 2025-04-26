import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('$electron', {
    sendMessageToMain: (message: any) => ipcRenderer.send('message-from-renderer', message),
    // onMessageFromMain: (callback: Function) =>
    //     ipcRenderer.on('message-from-main', (event, ...args) => callback(...args)),
});
