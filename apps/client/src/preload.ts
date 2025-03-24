import { contextBridge } from 'electron';

contextBridge.exposeInMainWorld('$electron', {
    test() {
        console.log('run by preload', 'preload.ts::5行');
    },
});
