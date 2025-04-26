import { app, BrowserWindow, Menu, Tray } from 'electron';

const isDevelopment = process.env.NODE_ENV === 'development';
import path from 'path';
import { injectListenEvents } from './events/events';

let newWin: BrowserWindow;
let tray: Tray;
const AppPath = app.getAppPath();

let isWindowHidden = true;

// 创建 Tray（系统托盘）
// 创建系统托盘
function createTray() {
    const iconPath = path.join(AppPath, 'static/icons/IconTemplate.png');
    tray = new Tray(iconPath); // 使用自定义图标

    const contextMenu = Menu.buildFromTemplate([
        {
            label: '显示主窗口',
            click: () => {
                newWin.show();
            },
        },
        {
            label: '退出',
            click: () => {
                app.quit();
            },
        },
    ]);

    tray.setToolTip('Electron 托盘示例');

    // **左键点击：切换窗口显示**
    tray.on('click', () => {
        if (isWindowHidden) {
            newWin.setOpacity(1); // 变回可见
            newWin.setIgnoreMouseEvents(false); // 允许窗口接收鼠标事件
            isWindowHidden = false;
        } else {
            newWin.setOpacity(0); // 变成透明
            newWin.setIgnoreMouseEvents(true, { forward: true }); // 允许鼠标穿透
            isWindowHidden = true;
        }
    });

    // **右键点击：弹出菜单**
    tray.on('right-click', () => {
        tray.popUpContextMenu(contextMenu);
    });
}

export function createMiniWindow() {
    newWin = new BrowserWindow({
        width: 360,
        height: 400,
        x: 1000,
        y: 60,
        alwaysOnTop: true,
        skipTaskbar: true,
        frame: false,
        opacity: 0,
        backgroundColor: 'rgba(255,255,255,0)',
        transparent: true,
        webPreferences: {
            nodeIntegration: true, // 允许在渲染进程使用 Node.js
            preload: path.join(__dirname, 'preload.js'),
        },
    });

    newWin.loadURL('http://localhost:8080/#/list');
    newWin.setIgnoreMouseEvents(true, { forward: true }); // 允许鼠标穿透

    injectListenEvents();

    createTray();
}
