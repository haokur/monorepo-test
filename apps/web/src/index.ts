import { count } from '@mono/utils';
import { getCombinationShortcut } from './utils/common';

// fetch('http://localhost:9090/env').then(async (res) => {
//     let data = await res.json();
//     console.log(data, count(4, 5), 'index.ts::7行');
// });

console.log(count(6, 6), process.env.ENV_CONFIG, 'index.ts::7行');
// $electron.test();

const KeyboardEventMap: {
    [key: string]: () => void;
} = {
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
document.addEventListener('keydown', (ev) => {
    const keyboardCode = getCombinationShortcut(ev);
    if (!keyboardCode) return;
    if (!KeyboardEventKeys.includes(keyboardCode)) return;
    KeyboardEventMap[keyboardCode]();
    ev.preventDefault();
});
