import { BrowserWindow } from 'electron';
import { broadcastAllWindows, send2RendererByWindow } from '../utils/electron.util';

export function getEnv() {
    const { electron, node, chrome, v8 } = process.versions;
    return { electron, node, chrome, v8 };
}

export function openDevTools(_options: IJsonObject, win: BrowserWindow) {
    win.webContents.openDevTools();
}

export function changeConnectStatus(data: { status: boolean }) {
    broadcastAllWindows('connect_change', data);
}
