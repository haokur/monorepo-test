import { getCombinationShortcut } from '@/utils/common';

const KeyboardEventMap: {
    [key: string]: () => void;
} = {
    'CommandOrControl+Shift+K': () => {
        $electron.emit('openDevTools');
        console.log('打开控制台', 'keyboard-shortcut.ts::7行');
    },
    Escape: () => {
        console.log('取消');
    },
    Left: () => {
        console.log('往左', 'index.ts::29行');
    },
    Right: () => {
        console.log('往右', 'index.ts::29行');
    },
    'CommandOrControl+W': () => {
        console.log('关闭', 'index.ts::29行');
    },
};
const KeyboardEventKeys = Object.keys(KeyboardEventMap);

export function bindShortcutEvent() {
    document.addEventListener('keydown', (ev) => {
        const keyboardCode = getCombinationShortcut(ev);
        if (!keyboardCode) return;
        if (!KeyboardEventKeys.includes(keyboardCode)) return;
        KeyboardEventMap[keyboardCode]();
        ev.preventDefault();
    });
}

// document.getElementById('test-ipc')?.addEventListener('click', (ev) => {
//     console.log(ev, 'index.ts::39行');
//     $electron.sendMessageToMain({
//         event: 'getCurrentEnv',
//         data: {
//             name: 'test',
//         },
//     });
// });
