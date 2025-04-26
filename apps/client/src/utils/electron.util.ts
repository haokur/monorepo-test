import { BrowserWindow } from 'electron';

// 发送给特定的renderer
export function send2RendererByWindow(
    event: string,
    message: EventMessageContent,
    win: BrowserWindow
) {
    win.webContents.send('message-from-main', event, message);
}

// 广播给所有renderer
export function broadcastAllWindows(event: string, message: EventMessageContent) {
    const allWindows = BrowserWindow.getAllWindows();
    allWindows.forEach((win) => send2RendererByWindow(event, message, win));
}
