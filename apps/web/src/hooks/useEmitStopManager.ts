import { onBeforeUnmount } from 'vue';

type StopFn = () => void;

interface ListenerRecord {
    stop: StopFn;
    action: string;
    callback: ((...args: any[]) => void) | null; // 允许 callback 变为 null
}

export function useEmitEventManager() {
    const listeners: ListenerRecord[] = [];

    /**
     * 注册监听
     */
    const emit = (action: string, payload: any, callback: (...args: any[]) => void) => {
        const stopFn = $electron.emit(action, payload, callback);
        if (typeof stopFn === 'function') {
            listeners.push({
                stop: stopFn,
                action,
                callback,
            });
        }
    };

    /**
     * 主动清理
     */
    const cleanup = () => {
        listeners.forEach((record) => {
            try {
                record.stop(); // 调用 stopFn 停止监听
            } catch (err) {
                console.error('stop函数出错:', err);
            }

            try {
                if (record.callback) {
                    // 这里不是 off，而是直接把callback置为null，释放引用
                    record.callback = null;
                }
            } catch (err) {
                console.error('callback释放出错:', err);
            }
        });
        listeners.length = 0;
    };

    onBeforeUnmount(() => {
        cleanup();
    });

    return { emit, cleanup };
}
