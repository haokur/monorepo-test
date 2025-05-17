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

function awaitResult() {
    return new Promise<void>((resolve, reject) => {
        setTimeout(() => {
            resolve();
        }, 5000);
    });
}

function whileResult() {
    let timestamp = Date.now();
    while (true) {
        if (Date.now() - timestamp > 10 * 1000) {
            break;
        }
    }
}

export function watchEvents(type: 'num' | 'code') {
    return (sender: Function, clear: Function) => {
        let count = 0;
        var codes = ['a', 'b', 'c', 'd', 'e', 'f', 'g'];

        if (type === 'num') {
            whileResult();
            count++;
            if (count < 10) {
                sender(count + 111);
            }
        } else {
            const timer = setInterval(() => {
                count++;
                const isFinished = count > 10 || (type === 'code' && codes.length - 1 < count);
                let result = type === 'code' ? codes[count] : count;
                if (isFinished) {
                    clearInterval(timer);
                    clear();
                } else {
                    sender(result);
                }
            }, 500);
        }
    };
}
