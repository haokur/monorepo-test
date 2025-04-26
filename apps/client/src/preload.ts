import { contextBridge, ipcRenderer } from 'electron';

const ListenerEventMap: Map<string, Set<(data: any) => void>> = new Map();

ipcRenderer.on('message-from-main', (_sender, action: string, message: EventMessageContent) => {
    const handlers = ListenerEventMap.get(action);
    if (!handlers || handlers.size === 0) return;
    handlers.forEach((handler) => {
        handler(message);
    });
});

contextBridge.exposeInMainWorld('$electron', {
    request(action: string, ...args: any) {
        return ipcRenderer.invoke('request-from-renderer', action, ...args);
    },
    emit(action: string, ...args: any) {
        ipcRenderer.send('message-from-renderer', action, ...args);
    },
    on(action: string, callback: (...args: any[]) => void) {
        if (!ListenerEventMap.has(action)) {
            ListenerEventMap.set(action, new Set());
        }
        ListenerEventMap.get(action)!.add(callback);
    },
    broadcast(action: string, ...args: any) {
        ipcRenderer.send('broadcast-from-renderer', action, ...args);
    },
    off(action: string, callback: (...args: any[]) => void) {
        ListenerEventMap.get(action)?.delete(callback);
    },
});
