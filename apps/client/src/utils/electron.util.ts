import nativeModule from '@mono/bridge';
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

const senderLogMsg = (...args: any[]) => {
    let content = args
        .map((item) => {
            if (typeof item === 'object') {
                return JSON.stringify(item);
            } else {
                return item.toString();
            }
        })
        .join('');
    nativeModule.log_message('main', content);
};

const createLogger = (prefix?: string) => {
    const formatArgs = (...args: any[]) => {
        return prefix ? [prefix, ...args] : args;
    };
    return {
        debug: (...args: any[]) => senderLogMsg('[DEBUG] ', ...formatArgs(...args)),
        info: (...args: any[]) => senderLogMsg('[INFO] ', ...formatArgs(...args)),
        warn: (...args: any[]) => senderLogMsg('[WARN] ', ...formatArgs(...args)),
        error: (...args: any[]) => senderLogMsg('[ERROR] ', ...formatArgs(...args)),
    };
};

// 打印日志
export const logger = createLogger();

export const getTagLogger = (tag: string) => {
    return createLogger(`[${tag}] `);
};
