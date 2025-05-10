import { contextBridge, ipcRenderer } from 'electron';

const uuidv4 = () => Date.now() + Math.random().toString(36).slice(2);

// on的持续监听
const ListenerEventMap: Map<string, Set<(data: any) => void>> = new Map();
ipcRenderer.on('message-from-main', (_sender, action: string, message: EventMessageContent) => {
    const handlers = ListenerEventMap.get(action);
    if (!handlers || handlers.size === 0) return;
    handlers.forEach((handler) => {
        handler(message);
    });
});

// emit的回调监听和清理
const EmitEventHandlerMap = new Map();
ipcRenderer.on('reply-for-emit', (_sender, message: EventMessageContent, actionId: string) => {
    const handler = EmitEventHandlerMap.get(actionId);
    handler && handler(message);
});
ipcRenderer.on('clear-for-emit', (_sender, actionId) => {
    EmitEventHandlerMap.delete(actionId);
});

type VoidCallback = (...args: any[]) => void;

function getLoggerFuncs() {
    const senderLogMsg = (level: string, ...args: any[]) => {
        let content = args.map((item) => item.toString()).join('');
        content = `[${level}] ${content}`;
        ipcRenderer.send('render-native-logger', content);
    };

    return {
        debug: (...args: any[]) => senderLogMsg('[DEBUG]', ...args),
        info: (...args: any[]) => senderLogMsg('[INFO]', ...args),
        warn: (...args: any[]) => senderLogMsg('[WARN]', ...args),
        error: (...args: any[]) => senderLogMsg('[ERROR]', ...args),
    };
}

contextBridge.exposeInMainWorld('$electron', {
    // 单次请求
    request(action: string, ...args: any) {
        return ipcRenderer.invoke('request-from-renderer', action, ...args);
    },
    // 广播到所有窗口，被on监听到（action与on的action对应上）
    broadcast(action: string, ...args: any[]) {
        ipcRenderer.send('broadcast-from-renderer', action, ...args);
    },
    // 持续监听消息
    on(action: string, callback: VoidCallback) {
        if (!ListenerEventMap.has(action)) {
            ListenerEventMap.set(action, new Set());
        }
        ListenerEventMap.get(action)!.add(callback);
        return () => ListenerEventMap.get(action)?.delete(callback);
    },
    // 有回调有返回，可使用返回值renderer里手动清理，需要在event-handler手动清理
    emit(action: string, data: EventMessageContent, callback: VoidCallback) {
        const actionId = uuidv4();
        EmitEventHandlerMap.set(actionId, callback);
        ipcRenderer.send('emit-from-renderer', action, data, actionId);
        return () => EmitEventHandlerMap.delete(actionId);
    },
    ...getLoggerFuncs(),
});
