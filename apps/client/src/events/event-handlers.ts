import { BrowserWindow } from 'electron';

export function getEnv() {
    const { electron, node, chrome, v8 } = process.versions;
    return { electron, node, chrome, v8 };
}

export function openDevTools(title: string | undefined, win: BrowserWindow) {
    console.log('openDevTools run', title, 'event-handlers.ts::9行');
    win.webContents.openDevTools({
        mode: 'detach',
        title,
    });
}

export function watchEvents(type: 'num' | 'code') {
    return (sender: Function, clear: Function) => {
        let count = 0;
        var codes = ['a', 'b', 'c', 'd', 'e', 'f', 'g'];
        const timer = setInterval(() => {
            count++;
            const isFinished =
                (type === 'num' && count > 10) || (type === 'code' && codes.length - 1 < count);
            let result = type === 'code' ? codes[count] : count;
            if (isFinished) {
                clearInterval(timer);
                clear();
            } else {
                sender(result);
            }
        }, 3000);
    };
}
