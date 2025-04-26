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
    // 监听从preload传递的消息
    ipcMain.on('message-from-renderer', async (event, action: HandlerKey, options) => {
        if (!action) {
            throw '请传入action参数';
        }

        if (action && eventHandlerFuncs[action]) {
            try {
                const senderWebContents = event.sender;
                const senderWindow = BrowserWindow.fromWebContents(senderWebContents)!;
                let result = await callHandler(action, options, senderWindow);
                if (typeof result === 'function') {
                    // 如果是方法，则调用执行，方法里去发送信息
                    result((data: any) => {
                        senderWebContents.send('replyRenderer', {
                            action,
                            result: data,
                            actionId: options.actionId,
                        });
                        console.log(`watch-${action}出参：\n${JSON.stringify(data, null, 4)}`);
                    });
                } else {
                    // 发送给C端
                    senderWebContents.send('replyRenderer', {
                        action,
                        result,
                        actionId: options.actionId,
                    });
                    console.log('\n\n>>>>>>>>>>>>>>>>>');
                    console.log(`${action}入参：\n${JSON.stringify(options, null, 4)}`);
                    console.log(`${action}出参：\n${JSON.stringify(result, null, 4)}`);
                    console.log('<<<<<<<<<<<<<<<<<\n');
                }
            } catch (error) {
                console.log(error);
            }
        } else {
            throw `action为${action},未找到该action的方法,请检查`;
        }
    });

    // 主进程通过 ipcMain 监听来自渲染进程的请求，并返回响应
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

    // 广播通知所有窗口
    ipcMain.handle('broadcast-from-renderer', async (_event, action: HandlerKey, options) => {
        broadcastAllWindows(action, options);
    });
}
