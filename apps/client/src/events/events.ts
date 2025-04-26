import { ipcMain, BrowserWindow } from 'electron';

import * as eventHandlerFuncs from './event-handlers';
import { broadcastAllWindows } from '../utils/electron.util';
type HandlerKey = keyof typeof eventHandlerFuncs;

async function callHandler<K extends HandlerKey>(name: K, ...args: any[]): Promise<any> {
    const handler = eventHandlerFuncs[name];
    const expectedArgCount = handler.length;
    return (handler as (...args: any[]) => void)(...args.slice(0, expectedArgCount));
}

export function injectListenEvents() {
    // 对应preload的request
    ipcMain.handle('request-from-renderer', async (event, action: HandlerKey, options) => {
        if (!action) {
            return Promise.reject('请传入action参数');
        }
        if (action && eventHandlerFuncs[action]) {
            try {
                const senderWebContents = event.sender;
                const senderWindow = BrowserWindow.fromWebContents(senderWebContents)!;
                let result = await callHandler(action, options, senderWindow);
                return result;
            } catch (error) {
                console.log(error);
                return Promise.reject('error');
            }
        } else {
            // throw `action为${action},未找到该action的方法,请检查`;
            return Promise.reject(`action为${action},未找到该action的方法,请检查`);
        }
    });

    // 对应preload的emit
    ipcMain.on('emit-from-renderer', async (event, action: HandlerKey, data, actionId) => {
        if (!action) {
            throw '请传入action参数';
        }
        if (action && eventHandlerFuncs[action]) {
            try {
                const senderWebContents = event.sender;
                const senderWindow = BrowserWindow.fromWebContents(senderWebContents)!;
                let callResult = await callHandler(action, data, senderWindow);
                const sender = (data: any) => {
                    senderWebContents.send('reply-for-emit', data, actionId);
                };
                const clearer = () => {
                    senderWebContents.send('clear-for-emit', actionId);
                };
                if (typeof callResult === 'function') {
                    return callResult(sender, clearer);
                }
                sender(callResult);
            } catch (error) {
                console.log(error);
            }
        } else {
            throw `action为${action},未找到该action的方法,请检查`;
        }
    });

    // 对应preload的broadcast
    ipcMain.on('broadcast-from-renderer', async (_event, action: string, options) => {
        broadcastAllWindows(action, options);
    });
}
